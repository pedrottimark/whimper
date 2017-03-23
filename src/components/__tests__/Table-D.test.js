/* @flow */

import React from 'react';
import {mount} from 'enzyme';
import {mountToShallowObject} from '../../testing/enzyme-to-json';
import {relevantTestObject} from '../../testing/react-test-renderer';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {receiveData} from '../../actions';
import reducer from '../../reducers';
import {fieldsReceived as fields} from '../../reducers/fields';
import {recordA, recordB, recordC, recordD} from '../../testing/records-data';

import Table from '../Table';
const TableRow = () => {}; // mock, and provide only relevant props

const clickDelete = ($it, i) => {
  $it.find('tbody tr').at(i).find('td').at(0).simulate('click');
};
const countRows = ($it) => Number($it.find('thead tr').at(1).find('th').at(0).text());
const tbodyShallow = ($it) => mountToShallowObject($it.find('tbody'));

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
    expect(countRows($it)).toEqual(records.length - 1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordA} />
        <TableRow record={recordC} />
        <TableRow record={recordD} />
      </tbody>
    ));
  });

  test('at the end', () => {
    clickDelete($it, 2);
    expect(countRows($it)).toEqual(records.length - 2);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordA} />
        <TableRow record={recordC} />
      </tbody>
    ));
  });

  test('at the beginning', () => {
    clickDelete($it, 0);
    expect(countRows($it)).toEqual(records.length - 3);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordC} />
      </tbody>
    ));
  });

  test('at the beginning and end', () => {
    clickDelete($it, 0);
    expect(countRows($it)).toEqual(records.length - 4);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody />
    ));
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
  expect($it.find('tbody tr').at(0).find('td').at(0).length).toBe(0);
});
