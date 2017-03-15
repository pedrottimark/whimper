import renderer from 'react-test-renderer';

const toEnumerableElement = (element) => Object.assign({}, element, {
  $$typeof: element.$$typeof,
  children: element.children === null || (element.children.length === 1 && element.children[0] === '')
    ? null
    : element.children.map((child) => typeof child === 'string' || typeof child === 'number'
        ? child
        : toEnumerableElement(child)
      ),
});

const toEnumerableObject = (object) => object && toEnumerableElement(object);

const renderAsTestObject = (element) => toEnumerableObject(renderer.create(element).toJSON());

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

function propsRelevant(props) {
  return Object.keys(props).reduce((reduced, key) => {
    if (key !== 'children') {
      const val = props[key];
      reduced[key] = val && val.$$typeof === reactSymbol
        ? relevantTestObject(val)
        : val
    }
    return reduced;
  }, {});
}

function childRelevant(child, array) {
  if (Array.isArray(child)) {
    return childrenRelevant(child, array);
  }
  if (child !== '') {  // for compatibility with mountToJson
    array.push(child && child.$$typeof === reactSymbol
      ? relevantTestObject(child) // recurse for object
      : child // non-element node
    );
  }
  return array;
}

function childrenRelevant(children, array) {
  return children.reduce((reduced, child) => childRelevant(child, reduced), array);
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
    object.props = propsRelevant(props);
  }

  // Omit `children` is it consists of the `irrelevant` sentinel value.
  if (children !== irrelevant) {
    if (typeof children === 'undefined') {
      object.children = null;
    } else {
      if (Array.isArray(children)) {
        object.children = childrenRelevant(children, []);
      } else {
        object.children = childRelevant(children, []);
      }
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
  renderAsTestObject,
};
