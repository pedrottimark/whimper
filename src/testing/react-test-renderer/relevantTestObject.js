const reactSymbol = Symbol.for('react.element');
const testSymbol = Symbol.for('react.test.json');

const irrelevant = '\u0007'; // BELL is tentative sentinel string

function typeOfElement(type) {
  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'function') {
    return type.displayName || type.name || 'Unknown';
  }
  return 'Unknown';
}

// Given the value of or any item in children prop of React element,
// return a flattened array of test objects and text nodes.
function childrenOfTestObject(arg, array = []) {
  if (Array.isArray(arg)) {
    // Either multiple children or
    // iteration adjacent to other rendered output: { array.map(item => node) }
    arg.forEach(child => { childrenOfTestObject(child, array); });
  } else if (arg !== null && arg !== undefined && typeof arg !== 'boolean') {
    // Omit item if it is any of the following: null, undefined, boolean.
    array.push(arg && arg.$$typeof === reactSymbol
      ? relevantTestObject(arg) // recurse if child is React element
      : arg // non-element node, especially text
    );
  }

  return array;
}

// Given a React element, return the element itself as a test object:
// `$$typeof` is enumerable
// `props` is undefined if there are no non-children properties
// `children` is undefined if they are irrelevant
function relevantTestObject(element) {
  const object = {
    $$typeof: testSymbol,
    type: typeOfElement(element.type),
  };

  const {children, ...props} = element.props;

  // Omit `props` if there are no properties, not counting `children`.
  if (Object.keys(props).length !== 0) {
    object.props = props;
  }

  // Omit `children` is it consists of the `irrelevant` sentinel value.
  if (children !== irrelevant) {
    if (children === undefined) {
      object.children = null;
    } else {
      const childrenFlattened = childrenOfTestObject(children);
      object.children = childrenFlattened.length !== 0
        ? childrenFlattened
        : null;
    }
  }

  return object;
}

module.exports = {
  irrelevant,
  relevantTestObject,
};
