/* @flow */

import React from 'react';
import {mount} from 'enzyme';
import {mountToShallowObject} from '../../testing/enzyme-to-json';
import {relevantTestObject} from '../../testing/relevant-test-object';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {receiveData} from '../../actions';
import reducer from '../../reducers';
import {fieldsInitial, fieldsReceived as fields} from '../../reducers/fields';
import {recordsInitial, recordDefault} from '../../reducers/records';
import {recordB, recordC, recordD} from '../../testing/records-data';

import Table from '../Table';
const TableRow = () => {}; // mock, and provide only relevant props

const countRecords = ($it) =>
  Number($it.find('thead tr').at(1).find('th').at(0).text());
const tbodyShallow = ($it) =>
  mountToShallowObject($it.find('tbody'));
const clickAdd = ($it) => {
  $it.find('thead tr').at(0).find('th').at(0).simulate('click');
};

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
    expect(countRecords($it)).toEqual(recordsInitial.length + 1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordAdded} />
      </tbody>
    ));
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
    expect(countRecords($it)).toEqual(recordsInitial.length + 1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordAdded} />
      </tbody>
    ));
  });

  test('a row preceding one existing row', () => {
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
    expect(countRecords($it)).toEqual(records.length + 1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordAdded} />
        <TableRow record={recordB} />
      </tbody>
    ));
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
    expect(countRecords($it)).toEqual(records.length + 1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordAdded} />
        <TableRow record={recordB} />
        <TableRow record={recordC} />
        <TableRow record={recordD} />
      </tbody>
    ));
  });
});
