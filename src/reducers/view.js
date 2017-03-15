import type {
  Action,
  FieldValue,
  Fields,
  FilteringCriterion,
  Record,
  View,
} from '../types';

const filteringInitial = '';
const sortingInitial = [];
export const viewInitial: View = {
  filtering: filteringInitial,
  sorting: sortingInitial,
};

export default function (view: View = viewInitial, action: Action): View {
  switch (action.type) {

    case 'SEARCH_RECORDS':
      return Object.assign({}, view, {
        filtering: action.filtering
      });

    case 'SORT_RECORDS':
      // Add current sorting criteria as first element of array.
      // Toggle descending if previous first element has same fieldKey.
      // The array can have at most one element for any fieldKey.
      return Object.assign({}, view, {
        sorting: action.fieldKey
          ? [{
              fieldKey: action.fieldKey,
              descending: view.sorting.length !== 0 &&
                view.sorting[0].fieldKey === action.fieldKey &&
                !view.sorting[0].descending,
            }].concat(view.sorting.filter(({fieldKey}) => fieldKey !== action.fieldKey))
          : sortingInitial
      });

    default:
      return view;
  }
}

// Return sorting comparision of field values.
const compareFieldValues = (fieldValueA: FieldValue, fieldValueB: FieldValue, descending: boolean): number => {
  const comparison = typeof fieldValueA === 'number' && typeof fieldValueB === 'number'
    ? fieldValueA - fieldValueB
    : String(fieldValueA).localeCompare(String(fieldValueB));

  return descending ? -comparison : comparison;
};

// Return sorting comparision of records for zero or more fields.
// Assume that the sorting is stable (for example, OrderedMap immutable collection).
const compareRecords = (recordA: Record, recordB: Record, sorting: SortingCriterion[]) : number =>
  sorting.reduce((comparison, {fieldKey, descending}) =>
    comparison || // compare field values only if all preceding comparisons are zero
    compareFieldValues(recordA[fieldKey], recordB[fieldKey], descending),
  0);

// Return whether the record has at least one field which includes the filtering string.
const filterRecord = (record: Record, fields: Fields, filtering: FilteringCriterion): boolean =>
  filtering.length === 0 || // not filtering
  fields.some(({key: fieldKey}) => record[fieldKey].toString().toLowerCase().includes(filtering));

// Return records to display in a view, given the sorting and filtering critera.
// A record id is its index in the currently stored list of records.
export const recordsInView = (records: Records, fields: Fields, {filtering, sorting}: View): Records =>
  records
    .filter((record) => filterRecord(record, fields, filtering))
    .sort((recordA, recordB) => compareRecords(recordA, recordB, sorting));
