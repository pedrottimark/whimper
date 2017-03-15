/* @flow */

import {createStore} from 'redux';

import {receiveData} from '../../actions';
import reducer, {
  fieldsInitial,
  fieldsReceived,
} from '../fields';

describe('fields reducer', () => {
  it('initializes value when you create a store', () => {
    const store = createStore(reducer);
    expect(store.getState()).toEqual(fieldsInitial);
  });

  it('replaces initial value from external source', () => {
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived)); // records are not needed to test fields
    expect(store.getState()).toEqual(fieldsReceived);
  });
});
