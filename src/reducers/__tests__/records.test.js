/* @flow */

import {createStore} from 'redux';

import {
  createRecord,
  receiveData,
  updateField,
  deleteRecord,
} from '../../actions';
import {fieldsReceived} from '../fields';
import reducer, {
  recordsInitial,
} from '../records';
import {
  recordA,
  recordB,
  recordC,
  recordD,
} from '../../testing/records-data';

const recordsReceived = [
  recordB,
  recordC,
  recordD,
];

const recordIdUpdated = recordD.id;
const recordUpdated = Object.assign({}, recordD, {
  what: 'ECMAScript 3.1',
  weep: 'too much, too late: 0.1 versions in 10 years?',
});

describe('records reducer', () => {
  it('initializes value when you create a store', () => {
    const store = createStore(reducer);
    expect(store.getState()).toEqual(recordsInitial);
  });

  it('replaces initial value with itself', () => {
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived, recordsInitial));
    expect(store.getState()).toEqual(recordsInitial);
  });

  it('replaces initial value from a data source', () => {
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived, recordsReceived));
    expect(store.getState()).toEqual(recordsReceived);
  });

  it('replaces non-initial value from a data source', () => {
    const store = createStore(reducer);
    store.dispatch(createRecord(recordA));
    // Overwrite the previous action.
    store.dispatch(receiveData(fieldsReceived, recordsReceived));
    expect(store.getState()).toEqual(recordsReceived);
  });

  it('creates a record preceding zero initial records', () => {
    const store = createStore(reducer);
    store.dispatch(createRecord(recordA));
    // Test uses a different implementation: array spread operator :)
    expect(store.getState()).toEqual([recordA, ...recordsInitial]);
  });

  it('creates a record preceding one existing record', () => {
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived, recordsReceived));
    store.dispatch(createRecord(recordA));
    // Test uses a different implementation: array spread operator :)
    expect(store.getState()).toEqual([recordA, ...recordsReceived]);
  });

  it('updates a field in a record', () => {
    fieldsReceived.forEach(({key}) => {
      const value = recordUpdated[key];
      const store = createStore(reducer);
      store.dispatch(receiveData(fieldsReceived, recordsReceived));
      store.dispatch(updateField(recordIdUpdated, key, value));
      store.getState().forEach((record, index) => {
        expect(record).toEqual(record.id === recordIdUpdated
          // Test uses a different implementation: object spread operator :)
          ? {
              ...recordsReceived[index],
              [key]: value,
            }
          : recordsReceived[index]
        );
      });
    });
  });

  it('updates all fields in a record', () => {
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived, recordsReceived));
    fieldsReceived.forEach(({key}) => {
      const value = recordUpdated[key];
      store.dispatch(updateField(recordIdUpdated, key, value));
    });
    store.getState().forEach((record, index) => {
      expect(record).toEqual(record.id === recordIdUpdated
        ? recordUpdated
        : recordsReceived[index]
      );
    });
  });

  it('deletes all records from first to last', () => {
    const records = [recordA, recordB, recordC, recordD];
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived, records));
    records.forEach((record, index) => {
      store.dispatch(deleteRecord(record.id));
      expect(store.getState()).toEqual(records.slice(index + 1));
    });
  });

  it('deletes all records from last to first', () => {
    const records = [recordA, recordB, recordC, recordD];
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived, records));
    const length = records.length;
    records.slice().reverse().forEach((record, index) => {
      store.dispatch(deleteRecord(record.id));
      expect(store.getState()).toEqual(records.slice(0, length - index - 1));
    });
  });

  describe('deletes records in arbitrary order', () => {
    const records = [recordA, recordB, recordC, recordD];
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived, records));

    test('in the middle', () => {
      store.dispatch(deleteRecord(recordB.id));
      expect(store.getState()).toEqual([recordA, recordC, recordD]);
    });
    test('at the end', () => {
      store.dispatch(deleteRecord(recordD.id));
      expect(store.getState()).toEqual([recordA, recordC]);
    });
    test('at the beginning', () => {
      store.dispatch(deleteRecord(recordA.id));
      expect(store.getState()).toEqual([recordC]);
    });
    test('at the beginning and end', () => {
      store.dispatch(deleteRecord(recordC.id));
      expect(store.getState()).toEqual([]);
    });
  });
});
