/* @flow */

import type {
  Action,
  DeleteRecordAction,
  UpdateFieldAction,
  Fields,
  Record,
  RecordId,
  Records,
} from '../types';

/*
// Convert internal collection from and to external JSON.
export const recordsFromJSON = (array: Record[]): Records => array;
export const recordsToJSON = (records: Records): Record[] => records;
*/

// Initial state of records before they have been received from external source.
export const recordsInitial: Records = [];

// A record object has an implicit and temporary id: its index in the array.
export default function (records: Records = recordsInitial, action: Action): Records {
  switch (action.type) {

  case 'CREATE_RECORD':
    // Create new record as first element of the collection.
    return [action.record].concat(records);

  case 'RECEIVE_DATA':
    // Replace initial records, except when whimper starts for the first time.
    return action.records || records;

  case 'UPDATE_FIELD': {
    // Destructuring and type cast to avoid warnings in Flow 0.35.0
    const {recordId, fieldKey, value} = (action: UpdateFieldAction);
    return records.map(record => record.id === recordId
      ? Object.assign({}, record, {[fieldKey]: value})
      : record
    );
  }

  case 'DELETE_RECORD': {
    // Destructuring and type cast to avoid warnings in Flow 0.35.0
    const {recordId} = (action: DeleteRecordAction);
    return records.filter(record => record.id !== recordId);
  }

  default:
    return records;

  }
}

// A very naive algorithm, instead of hashing ;)
const unusedId = (records: Records): RecordId =>
  records.reduce((id, record) => id <= record.id ? record.id + 1 : id, 0);

// Given fields, return a record with default values.
// For example, to create a new record.
export const recordDefault = (fields: Fields, records: Records): Record =>
  fields.reduce((record, {key, defaultValue}) => {
    record[key] = defaultValue;
    return record;
  }, {
    id: unusedId(records)
  });
