/* @flow */

import React from 'react';
import {mount} from 'enzyme';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {receiveData} from '../../actions';
import reducer from '../../reducers';
import {fieldsInitial, fieldsReceived as fields} from '../../reducers/fields';
import {recordsInitial, recordDefault} from '../../reducers/records';
import {recordB, recordC, recordD} from '../../testing/records-data';

import Table from '../Table';

const countRows = ($it) =>
  Number($it.find('thead tr').at(1).find('th').at(0).text());
const clickAdd = ($it) => {
  $it.find('thead tr').at(0).find('th').at(0).simulate('click');
};
const recordAtTableRow = ($it, i) =>
  $it.find('TableRow').at(i).prop('record');
const countTableRows = ($it) => $it.find('TableRow').length;

describe('Table', () => {
  it('creates a row with initial empty fields', () => {
    const recordAdded = recordDefault(fieldsInitial, recordsInitial);
    const store = createStore(reducer);
    const $it = mount(
      <Provider store={store}>
        <Table />
      </Provider>
    );

    clickAdd($it);
    expect(countRows($it)).toEqual(recordsInitial.length + 1);
    expect(recordAtTableRow($it, 0)).toEqual(recordAdded);
  });

  it('creates a row with received fields', () => {
    const recordAdded = recordDefault(fields, recordsInitial);
    const store = createStore(reducer);
    store.dispatch(receiveData(fields));
    const $it = mount(
      <Provider store={store}>
        <Table />
      </Provider>
    );

    clickAdd($it);
    expect(countRows($it)).toEqual(recordsInitial.length + 1);
    expect(countTableRows($it)).toEqual(recordsInitial.length + 1);
    expect(recordAtTableRow($it, 0)).toEqual(recordAdded);
  });

  it('creates a row preceding one existing row', () => {
    const records = [recordB];
    const recordAdded = recordDefault(fields, records);
    const store = createStore(reducer);
    store.dispatch(receiveData(fields, records));
    const $it = mount(
      <Provider store={store}>
        <Table />
      </Provider>
    );

    clickAdd($it);
    expect(countRows($it)).toEqual(records.length + 1);
    expect(countTableRows($it)).toEqual(records.length + 1);
    expect(recordAtTableRow($it, 0)).toEqual(recordAdded);
    expect(recordAtTableRow($it, 1)).toEqual(recordB);
  });

  test('a row preceding more than one existing row', () => {
    const records = [recordB, recordC, recordD];
    const recordAdded = recordDefault(fields, records);
    const store = createStore(reducer);
    store.dispatch(receiveData(fields, records));
    const $it = mount(
      <Provider store={store}>
        <Table />
      </Provider>
    );

    clickAdd($it);
    expect(countRows($it)).toEqual(records.length + 1);
    expect(countTableRows($it)).toEqual(records.length + 1);
    expect(recordAtTableRow($it, 0)).toEqual(recordAdded);
    expect(recordAtTableRow($it, 1)).toEqual(recordB);
    expect(recordAtTableRow($it, 2)).toEqual(recordC);
    expect(recordAtTableRow($it, 3)).toEqual(recordD);
  });
});
