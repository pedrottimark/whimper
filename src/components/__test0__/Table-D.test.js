/* @flow */

import React from 'react';
import {mount} from 'enzyme';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {receiveData} from '../../actions';
import reducer from '../../reducers';
import {fieldsReceived as fields} from '../../reducers/fields';
import {
  clickDelete,
  countRecords,
  countTableRows,
  recordAtTableRow,
} from '../../testing/selectors';
import {
  recordA,
  recordB,
  recordC,
  recordD,
} from '../../testing/records-data';

import Table from '../Table';

describe('Table deletes records', () => {
  const store = createStore(reducer);
  const records = [recordA, recordB, recordC, recordD];
  store.dispatch(receiveData(fields, records));
  const $it = mount(
    <Provider store={store}>
      <Table />
    </Provider>
  );

  test('in the middle', () => {
    clickDelete($it, 1); // recordB is in the middle
    expect(countRecords($it)).toEqual(records.length - 1);
    expect(countTableRows($it)).toEqual(records.length - 1);
    expect(recordAtTableRow($it, 0)).toEqual(recordA);
    expect(recordAtTableRow($it, 1)).toEqual(recordC);
    expect(recordAtTableRow($it, 2)).toEqual(recordD);
  });

  test('at the end', () => {
    clickDelete($it, 2);
    expect(countRecords($it)).toEqual(records.length - 2);
    expect(countTableRows($it)).toEqual(records.length - 2);
    expect(recordAtTableRow($it, 0)).toEqual(recordA);
    expect(recordAtTableRow($it, 1)).toEqual(recordC);
  });

  test('at the beginning', () => {
    clickDelete($it, 0);
    expect(countRecords($it)).toEqual(records.length - 3);
    expect(countTableRows($it)).toEqual(records.length - 3);
    expect(recordAtTableRow($it, 0)).toEqual(recordC);
  });

  test('at the beginning and end', () => {
    clickDelete($it, 0);
    expect(countRecords($it)).toEqual(records.length - 4);
    expect(countTableRows($it)).toEqual(records.length - 4);
  });
});


describe('Table cannot delete records if there are none', () => {
  const store = createStore(reducer);
  store.dispatch(receiveData(fields, []));
  const $it = mount(
    <Provider store={store}>
      <Table />
    </Provider>
  );
  expect(countTableRows($it)).toEqual(0);
});
