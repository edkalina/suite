// @flow
import validAttr from '@emotion/is-prop-valid';
import merge from 'merge-anything';
import React, {
  createElement,
  useContext,
  useDebugValue,
  type AbstractComponent,
  type Ref,
} from 'react';
import ComponentStyle from './ComponentStyle';
import createWarnTooManyClasses from '../utils/createWarnTooManyClasses';
import determineTheme from '../utils/determineTheme';
import escape from '../utils/escape';
import generateDisplayName from '../utils/generateDisplayName';
import getComponentName from '../utils/getComponentName';
import hoist from '../utils/hoist';
import isFunction from '../utils/isFunction';
import isTag from '../utils/isTag';
import isStyledComponent from '../utils/isStyledComponent';
import hasher from '../utils/hasher';
import { ThemeContext } from './ThemeProvider';
import { useStyleSheet } from './StyleSheetManager';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../utils/empties';

import type { Attrs, RuleSet, Target } from '../types';

/* global $Call */

const THEME_PROP_R = /\.theme[.[]/;
const identifiers = {};

/* We depend on components having unique IDs */
export function generateId(displayName: string, parentComponentId: string) {
  const name = typeof displayName !== 'string' ? 'sc' : escape(displayName);
  // Ensure that no displayName can lead to duplicate componentIds
  identifiers[name] = (identifiers[name] || 0) + 1;

  const componentId = `${name}-${hasher(name + identifiers[name])}`;
  return parentComponentId ? `${parentComponentId}-${componentId}` : componentId;
}

function useResolvedAttrs<Config>(theme: any = EMPTY_OBJECT, props: Config, attrs: Attrs) {
  // NOTE: can't memoize this
  // returns [context, resolvedAttrs]
  // where resolvedAttrs is only the things injected by the attrs themselves
  const context = { ...props, theme };
  const resolvedAttrs = {};

  attrs.forEach(attrDef => {
    let resolvedAttrDef = attrDef;
    let key;

    if (isFunction(resolvedAttrDef)) {
      resolvedAttrDef = resolvedAttrDef(context);
    }

    /* eslint-disable guard-for-in */
    for (key in resolvedAttrDef) {
      context[key] = resolvedAttrs[key] = resolvedAttrDef[key];
    }
    /* eslint-enable guard-for-in */
  });

  return [context, resolvedAttrs];
}

interface StyledComponentWrapperProperties {
  attrs: Attrs;
  componentStyle: ComponentStyle;
  displayName: string;
  foldedComponentIds: Array<string>;
  target: Target;
  styledComponentId: string;
  warnTooManyClasses: $Call<typeof createWarnTooManyClasses, string>;
  usesTheme: boolean;
}

type StyledComponentWrapper<Config, Instance> = AbstractComponent<Config, Instance> &
  StyledComponentWrapperProperties;

function useInjectedStyle<T>(
  componentStyle: ComponentStyle,
  hasAttrs: boolean,
  resolvedAttrs: T,
  warnTooManyClasses?: $Call<typeof createWarnTooManyClasses, string>
) {
  const styleSheet = useStyleSheet();

  // statically styled-components don't need to build an execution context object,
  // and shouldn't be increasing the number of class names
  const isStatic = componentStyle.isStatic && !hasAttrs;

  const className = isStatic
    ? componentStyle.generateAndInjectStyles(EMPTY_OBJECT, styleSheet)
    : componentStyle.generateAndInjectStyles(resolvedAttrs, styleSheet);

  useDebugValue(className);

  if (process.env.NODE_ENV !== 'production' && !isStatic && warnTooManyClasses) {
    warnTooManyClasses(className);
  }

  return className;
}

function useStyledComponentImpl<Config: {}, Instance>(
  forwardedComponent: StyledComponentWrapper<Config, Instance>,
  props: Object,
  forwardedRef: Ref<any>
) {
  const {
    attrs: componentAttrs,
    componentStyle,
    // $FlowFixMe
    defaultProps,
    foldedComponentIds,
    styledComponentId,
    target,
  } = forwardedComponent;

  useDebugValue(styledComponentId);

  // NOTE: the non-hooks version only subscribes to this when !componentStyle.isStatic,
  // but that'd be against the rules-of-hooks. We could be naughty and do it anyway as it
  // should be an immutable value, but behave for now.
  const theme = determineTheme(props, useContext(ThemeContext), defaultProps);

  const [context, attrs] = useResolvedAttrs(theme || EMPTY_OBJECT, props, componentAttrs);

  const generatedClassName = useInjectedStyle(
    componentStyle,
    componentAttrs.length > 0,
    context,
    process.env.NODE_ENV !== 'production' ? forwardedComponent.warnTooManyClasses : undefined
  );

  if (process.env.NODE_ENV !== 'production' && forwardedComponent.usesTheme && !theme) {
    console.error(
      `Component ${
        // $FlowFixMe
        forwardedComponent.displayName
      } (.${styledComponentId}) uses "props.theme" in its styles but no theme was provided via prop or ThemeProvider.`
    );

    // cheap way to do "once" ;)
    // eslint-disable-next-line no-param-reassign
    forwardedComponent.usesTheme = false;
  }

  const refToForward = forwardedRef;

  const elementToBeCreated: Target = props.as || attrs.as || target;

  const isTargetTag = isTag(elementToBeCreated);
  const computedProps = attrs !== props ? { ...attrs, ...props } : props;
  const shouldFilterProps = isTargetTag || 'as' in computedProps || 'forwardedAs' in computedProps;
  const propsForElement = shouldFilterProps ? {} : { ...computedProps };

  if (shouldFilterProps) {
    // eslint-disable-next-line guard-for-in
    for (const key in computedProps) {
      if (key === 'forwardedAs') {
        propsForElement.as = computedProps[key];
      } else if (key !== 'as' && key !== 'forwardedAs' && (!isTargetTag || validAttr(key))) {
        // Don't pass through non HTML tags through to HTML elements
        propsForElement[key] = computedProps[key];
      }
    }
  }

  if (props.style && attrs.style !== props.style) {
    propsForElement.style = { ...attrs.style, ...props.style };
  }

  propsForElement.className = Array.prototype
    .concat(
      foldedComponentIds,
      styledComponentId,
      generatedClassName !== styledComponentId ? generatedClassName : null,
      props.className,
      attrs.className
    )
    .filter(Boolean)
    .join(' ');

  propsForElement.ref = refToForward;

  return createElement(elementToBeCreated, propsForElement);
}

export default function createStyledComponent(
  target: Target | StyledComponentWrapper<*, *>,
  options: Object,
  rules: RuleSet
) {
  const isTargetStyledComp = isStyledComponent(target);
  const isCompositeComponent = !isTag(target);

  const {
    displayName = generateDisplayName(target),
    componentId = generateId(options.displayName, options.parentComponentId),
    attrs = EMPTY_ARRAY,
  } = options;

  const styledComponentId =
    options.displayName && options.componentId
      ? `${escape(options.displayName)}-${options.componentId}`
      : options.componentId || componentId;

  // fold the underlying StyledComponent attrs up (implicit extend)
  const finalAttrs =
    // $FlowFixMe
    isTargetStyledComp && target.attrs
      ? Array.prototype.concat(target.attrs, attrs).filter(Boolean)
      : attrs;

  const componentStyle = new ComponentStyle(
    isTargetStyledComp
      ? // fold the underlying StyledComponent rules up (implicit extend)
        // $FlowFixMe
        target.componentStyle.rules.concat(rules)
      : rules,
    styledComponentId
  );

  /**
   * forwardRef creates a new interim component, which we'll take advantage of
   * instead of extending ParentComponent to create _another_ interim class
   */
  let WrappedStyledComponent;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const forwardRef = (props, ref) => useStyledComponentImpl(WrappedStyledComponent, props, ref);

  forwardRef.displayName = displayName;

  // $FlowFixMe this is a forced cast to merge it StyledComponentWrapperProperties
  WrappedStyledComponent = (React.forwardRef(forwardRef): StyledComponentWrapper<*, *>);

  WrappedStyledComponent.attrs = finalAttrs;
  WrappedStyledComponent.componentStyle = componentStyle;
  WrappedStyledComponent.displayName = displayName;

  // this static is used to preserve the cascade of static classes for component selector
  // purposes; this is especially important with usage of the css prop
  WrappedStyledComponent.foldedComponentIds = isTargetStyledComp
    ? // $FlowFixMe
      Array.prototype.concat(target.foldedComponentIds, target.styledComponentId)
    : EMPTY_ARRAY;

  WrappedStyledComponent.styledComponentId = styledComponentId;

  // fold the underlying StyledComponent target up since we folded the styles
  WrappedStyledComponent.target = isTargetStyledComp
    ? // $FlowFixMe
      target.target
    : target;

  // $FlowFixMe
  WrappedStyledComponent.withComponent = function withComponent(tag: Target) {
    const { componentId: previousComponentId, ...optionsToCopy } = options;

    const newComponentId =
      previousComponentId &&
      `${previousComponentId}-${isTag(tag) ? tag : escape(getComponentName(tag))}`;

    const newOptions = {
      ...optionsToCopy,
      attrs: finalAttrs,
      componentId: newComponentId,
    };

    return createStyledComponent(tag, newOptions, rules);
  };

  // $FlowFixMe
  Object.defineProperty(WrappedStyledComponent, 'defaultProps', {
    get() {
      return this._foldedDefaultProps;
    },

    set(obj) {
      // $FlowFixMe
      this._foldedDefaultProps = isTargetStyledComp ? merge(target.defaultProps, obj) : obj;
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    WrappedStyledComponent.usesTheme = componentStyle.rules.some(
      x => isFunction(x) && THEME_PROP_R.test(x.toString())
    );

    WrappedStyledComponent.warnTooManyClasses = createWarnTooManyClasses(displayName);
  }

  // $FlowFixMe
  WrappedStyledComponent.toString = () => `.${WrappedStyledComponent.styledComponentId}`;

  if (isCompositeComponent) {
    hoist(WrappedStyledComponent, target, {
      // all SC-specific things should not be hoisted
      attrs: true,
      componentStyle: true,
      displayName: true,
      foldedComponentIds: true,
      self: true,
      styledComponentId: true,
      target: true,
      withComponent: true,
    });
  }

  return WrappedStyledComponent;
}
