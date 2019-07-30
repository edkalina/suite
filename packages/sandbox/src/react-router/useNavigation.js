import { useContext } from 'react';
import {__RouterContext} from 'react-router'
import { createLocation } from "history";

export const resolveToLocation = (to, currentLocation) =>
  typeof to === "function" ? to(currentLocation) : to;

export const normalizeToLocation = (to, currentLocation) => {
  return typeof to === "string"
    ? createLocation(to, null, null, currentLocation)
    : to;
};

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export function useNavigation() {
  const context = useContext(__RouterContext);
  const { history } = context;

  const navigate = (to, replace = false) => {
    const location = resolveToLocation(to, context.location);
    const method = replace ? history.replace : history.push;

    method(location);
  };

  const hrefDecorator = to => (component, props, ...children) => {
    const { onClick, historyReplace, target, ...restProps } = props || {};

    const location = normalizeToLocation(
      resolveToLocation(to, context.location),
      context.location
    );

    const href = location ? history.createHref(location) : "";

    return [
      component,
      {
        ...restProps,
        href,
        target,
        onClick: event => {
          try {
            if (onClick) onClick(event);
          } catch (ex) {
            event.preventDefault();
            throw ex;
          }

          if (
            !event.defaultPrevented && // onClick prevented default
            event.button === 0 && // ignore everything but left clicks
            (!target || target === "_self") && // let browser handle "target=_blank" etc.
            !isModifiedEvent(event) // ignore clicks with modifier keys
          ) {
            event.preventDefault();
            navigate(to, historyReplace);
          }
        }
      },
      ...children
    ];
  };

  const toDecorator = to => (component, props, ...children) => {
    const { onClick, historyReplace, ...restProps } = props;

    return [
      component,
      {
        ...restProps,
        onClick: event => {
          try {
            if (onClick) onClick(event);
          } catch (ex) {
            event.preventDefault();
            throw ex;
          }

          if (
            !event.defaultPrevented && // onClick prevented default
            event.button === 0 // ignore everything but left clicks
          ) {
            event.preventDefault();
            navigate(to, historyReplace);
          }
        }
      },
      ...children
    ];
  };

  return { navigate, to: toDecorator, href: hrefDecorator };
}
