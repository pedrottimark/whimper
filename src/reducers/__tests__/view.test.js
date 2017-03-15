/* @flow */

import {createStore} from 'redux';

import {
  //filterRecords,
  sortRecords,
} from '../../actions';
import reducer from '../view';

describe('view reducer sorting', () => {
  const whenKey = 'when';
  const whatKey = 'what';
  const store = createStore(reducer);

  it('is ascending for first criterion', () => {
    store.dispatch(sortRecords(whatKey));
    expect(store.getState().sorting).toEqual([
      {
        fieldKey: whatKey,
        descending: false,
      },
    ]);
  });

  it('is ascending for second criterion', () => {
    store.dispatch(sortRecords(whenKey));
    expect(store.getState().sorting).toEqual([
      {
        fieldKey: whenKey,
        descending: false,
      },
      {
        fieldKey: whatKey,
        descending: false,
      },
    ]);
  });

  it('is descending for second criterion again', () => {
    store.dispatch(sortRecords(whenKey));
    expect(store.getState().sorting).toEqual([
      {
        fieldKey: whenKey,
        descending: true,
      },
      {
        fieldKey: whatKey,
        descending: false,
      },
    ]);
  });

  it('is ascending for first criterion again', () => {
    store.dispatch(sortRecords(whatKey));
    expect(store.getState().sorting).toEqual([
      {
        fieldKey: whatKey,
        descending: false,
      },
      {
        fieldKey: whenKey,
        descending: true,
      },
    ]);
  });

  it('is ascending for second criterion again', () => {
    store.dispatch(sortRecords(whenKey));
    expect(store.getState().sorting).toEqual([
      {
        fieldKey: whenKey,
        descending: false,
      },
      {
        fieldKey: whatKey,
        descending: false,
      },
    ]);
  });

  it('resets for undefined key', () => {
    store.dispatch(sortRecords());
    expect(store.getState().sorting).toEqual([]);
  });
});
