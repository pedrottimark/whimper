'use strict';

import omitBy from 'lodash.omitby';
import isNil from 'lodash.isnil';

const reactSymbol = Symbol.for('react.element');
const testSymbol = Symbol.for('react.test.json');

const irrelevant = '\u0007'; // BELL

function typeOfElement(type) {
  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'function') {
    return type.displayName || type.name || 'Unknown';
  }
  return 'Unknown';
}

function childrenInTestObject(arg, array) {
  if (Array.isArray(arg)) {
    // Iteration adjacent to other rendered output: { array.map(item => node) }
    return arg.reduce((reduced, child) => childrenInTestObject(child, reduced), array);
  }

  if(!isNil(arg) && typeof arg !== 'boolean') {
    array.push(arg && arg.$$typeof === reactSymbol
      ? relevantTestObject(arg) // recurse for object
      : arg // non-element node
    );
  }
  return array;
}

// Given a React element, return the element itself as a test object:
// `$$typeof` is enumerable
// `props` is undefined if there are no non-children properties
// `children` is undefined if they are irrelevant
function relevantTestObject(arg) {
  const {type, props} = arg;
  const object = {
    $$typeof: testSymbol,
    type: typeOfElement(type),
  };

  // Omit `props` if there are no properties, not counting `children`.
  const keys = Object.keys(props);
  const children = props.children;
  if (keys.length !== (children ? 1 : 0)) {
    object.props = omitBy(props, (val, key) => key === 'children');
  }

  // Omit `children` is it consists of the `irrelevant` sentinel value.
  if (children !== irrelevant) {
    if (typeof children === 'undefined') {
      object.children = null;
    } else {
      object.children = childrenInTestObject(children, []);
      if (object.children.length === 0) {
        object.children = null;
      }
    }
  }

  return object;
}

module.exports = {
  irrelevant,
  relevantTestObject,
};
