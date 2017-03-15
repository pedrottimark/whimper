import enzymeToJSON from 'enzyme-to-json';
import {mountToJson, renderToJson, shallowToJson} from 'enzyme-to-json';

export {mountToJson, renderToJson, shallowToJson};
export default enzymeToJSON;

function childrenDeep(children) {
  if (children === null) {
    return children;
  }

  //const childrenMapped = (Array.isArray(children) ? children : [children]) // TODO
  const childrenMapped = children
    .map((child, i, array) => child === null || typeof child === 'string' || typeof child === 'number'
        ? child
        : elementDeep(child) // recurse
    ).filter(child => child !== null);

  return childrenMapped.length === 0
    ? null
    : childrenMapped;
}

function elementDeep(element) {
  const {type, props, children} = element;

  if (type === type.toLowerCase()) {
    // Return a DOM element.
    return Object.assign({}, element, {
      children: childrenDeep(children)
    });
  }

  // Return the rendered value of a React component.
  // So far, React requires that render returns either zero or one element.
  return children === null
    ? children
    : elementDeep(children[0]);
}

// Given a wrapper from Enzyme mount(element) or traversal from it,
// return an element compatible with react-test-renderer.
export const mountToDeepObject = (wrapper) => elementDeep(mountToJson(wrapper));

function childrenShallow(children) {
  if (children === null) {
    return children;
  }

  const childrenMapped = children
    .map((child, i, array) => child === null || typeof child === 'string' || typeof child === 'number'
        ? child
        : elementShallow(child) // recurse
    ).filter(child => child !== null);

  return childrenMapped.length === 0
    ? null
    : childrenMapped;
}

function elementShallow(element) {
  const {type, children} = element;

  return Object.assign({}, element, {
    children: type === type.toLowerCase()
      ? childrenShallow(children)
      : null
  });
}

export const mountToShallowObject = (wrapper) => elementShallow(mountToJson(wrapper));
