// @flow
import { useContext, useRef } from 'react';
import createGlobalStyle from './constructors/createGlobalStyle';
import cssTag from './constructors/css';
import keyframes from './constructors/keyframes';
import styled from './constructors/styled';

import ComponentStyle from './models/ComponentStyle';
import { generateId } from './models/StyledComponent';
import StyleSheetManager, { useStyleSheet } from './models/StyleSheetManager';
import { ThemeContext } from './models/ThemeProvider';

import createWarnTooManyClasses from './utils/createWarnTooManyClasses';
import { EMPTY_OBJECT } from './utils/empties';

import type { RuleSet } from './types';

export { styled, keyframes, StyleSheetManager, createGlobalStyle };

export function useSuite() {
  const cssClassCache = useRef({});
  const styleSheet = useStyleSheet();
  const theme = useContext(ThemeContext);

  function generateAndInjectStyles(cssClass, props) {
    const { componentStyle, params } = cssClass;
    const { isStatic, componentId } = componentStyle;

    const classNameValue = isStatic
      ? componentStyle.generateAndInjectStyles(EMPTY_OBJECT, styleSheet)
      : componentStyle.generateAndInjectStyles(
          { ...params, theme, props: props || EMPTY_OBJECT },
          styleSheet
        );

    if (process.env.NODE_ENV !== 'production' && !isStatic && cssClass.warnTooManyClasses) {
      cssClass.warnTooManyClasses(classNameValue);
    }

    return `${componentId} ${classNameValue}`;
  }

  function getClassName(arg, props) {
    if (Array.isArray(arg)) {
      return (
        arg
          .map(cc => getClassName(cc, props))
          .filter(Boolean)
          .join(' ') || undefined
      );
    }

    if (!arg || arg === true) {
      return undefined;
    }

    if (arg.componentStyle) {
      return generateAndInjectStyles(arg, props);
    }

    return arg;
  }

  function getCSSClassForFragemnt(fragment) {
    if (!cssClassCache.current[fragment.config.id]) {
      const componentStyle = new ComponentStyle(fragment.rules, generateId());
      cssClassCache.current[fragment.config.id] = createCSSClass(componentStyle);
    }

    return cssClassCache.current[fragment.config.id];
  }

  const className = classes => (tag, props, ...children) => {
    return [
      tag,
      { ...props, className: getClassName([classes, props && props.className], props) },
      ...children,
    ];
  };

  const classProps = classesMap => (tag, props, ...children) => {
    const classesProps = Object.keys(classesMap).reduce((memo, key) => {
      memo[key] = getClassName([classesMap[key], props && props[key]], props);

      return memo;
    }, {});
    return [tag, { ...props, ...classesProps }, ...children];
  };

  const style = fragment => (tag, props, ...children) => {
    if (!fragment.config || !fragment.config.id) {
      throw new Error('Fragemnt should be idetified');
    }

    const cssClass = getCSSClassForFragemnt(fragment);
    const classNameValue = generateAndInjectStyles(cssClass, props);

    return [tag, { ...props, className: classNameValue }, ...children];
  };

  return { className, classProps, style };
}

function createFragment(rules: RuleSet, config) {
  return { rules, config };
}

function createCSSClass(componentStyle, data, parent) {
  const cssClass = params =>
    createCSSClass(
      componentStyle,
      {
        ...data,
        params: data && data.params ? { ...data.params, ...params } : params,
      },
      cssClass
    );

  cssClass.componentStyle = componentStyle;

  if (process.env.NODE_ENV !== 'production') {
    cssClass.warnTooManyClasses = createWarnTooManyClasses('UNKNOWN');
  }

  // $FlowFixMe
  cssClass.toString = () => `.${componentStyle.componentId}`;

  cssClass.fragment = parent ? parent.fragment : createFragment(componentStyle.rules);

  return data ? Object.assign(cssClass, data) : cssClass;
}

export function css(...args) {
  const classId = generateId();

  const componentStyle = new ComponentStyle(cssTag(...args), classId);
  return createCSSClass(componentStyle);
}

css.fragment = (...args) => createFragment(cssTag(...args));

css.fragment.withConfig = config => (...args) => createFragment(cssTag(...args), config);
