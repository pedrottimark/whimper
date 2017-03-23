import isNil from 'lodash.isnil';

// For mountToJson
export const omitFromPropsMinimal = (val, key) => key === 'children' || val === undefined;
export const includeInChildrenMinimal = item => !isNil(item) && item !== '';

// For mountToDeepJson and mountToShallowJson
// to return test objects which are compatible with react-test-renderer
export const omitFromPropsCompatible = (val, key) => key === 'children';
export const includeInChildrenCompatible = item => !isNil(item);
