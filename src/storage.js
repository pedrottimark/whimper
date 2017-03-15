import {
  fieldsReceived, // production app might get fields from external source :)
} from './reducers/fields';
import {
  recordsInitial,
} from './reducers/records';

import {
  Fields,
  Records,
} from './types';

const RECORDS_KEY = 'whimper-records';

// Get fields and records data after whimper starts.
export function readData(callback: (fields: Fields, records?: Records) => void) {
  let records;
  const value = localStorage.getItem(RECORDS_KEY);
  if (value === null) {
    // Write the initial state when whimper runs the first time.
    writeRecords(recordsInitial);
  } else {
    records = JSON.parse(value);
  }
  callback(fieldsReceived, records);
}

// Set records data after it has changed.
export function writeRecords(records: Records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}
