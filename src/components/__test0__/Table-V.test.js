/* @flow */

import React from 'react';
import {mount} from 'enzyme';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {receiveData} from '../../actions';
import reducer from '../../reducers';
import {fieldsReceived as fields} from '../../reducers/fields';
import {
  recordA,
  recordB,
  recordC,
  recordD,
} from '../../testing/records-data';

import Table from '../Table';
const TableRow = () => {}; // mock, and provide only relevant props

const typeFilter = ($it) => {
  $it.find('thead input').simulate('TODO');
};
const countRecords = ($it) => Number($it.find('thead tr').at(1).find('th').at(0).text());
const recordAtTableRow = ($it, i) => $it.find('TableRow').at(i).prop('record');
/*
describe('Table filters rows according to filter string', () => {
    const store = createStore(reducer);
    const records = [recordA, recordB, recordC, recordD];
    store.dispatch(receiveData(fields, records));
    const $it = mount(
      <Provider store={store}>
        <Table />
      </Provider>
    );

    // t
    expect(countRecords($it)).toEqual(4);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordA} />
        <TableRow record={recordB} />
        <TableRow record={recordC} />
        <TableRow record={recordD} />
      </tbody>
    ));

    // to
    expect(countRecords($it)).toEqual(2);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordA} />
        <TableRow record={recordD} />
      </tbody>
    ));

    // too
    expect(countRecords($it)).toEqual(1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordD} />
      </tbody>
    ));

    // tool
    expect(countRecords($it)).toEqual(0);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
      </tbody>
    ));

    // l
    expect(countRecords($it)).toEqual(3);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordA} />
        <TableRow record={recordB} />
        <TableRow record={recordD} />
      </tbody>
    ));
});
*/

describe('Table sorting', () => {
  const clickHeading = ($it, i) => {
    $it.find('thead tr').at(1).find('th').at(1 + i).simulate('click');
  };

  const store = createStore(reducer);
  const records = [recordA, recordB, recordC, recordD];
  store.dispatch(receiveData(fields, records));
  const $it = mount(
    <Provider store={store}>
      <Table />
    </Provider>
  );

  it('is ascending on click `what` heading', () => {
    clickHeading($it, 1);
    expect(recordAtTableRow($it, 0)).toEqual(recordA);
    expect(recordAtTableRow($it, 1)).toEqual(recordD);
    expect(recordAtTableRow($it, 2)).toEqual(recordC);
    expect(recordAtTableRow($it, 3)).toEqual(recordB);
  });

  it('is descending on click `what` heading again', () => {
    clickHeading($it, 1);
    expect(recordAtTableRow($it, 0)).toEqual(recordB);
    expect(recordAtTableRow($it, 1)).toEqual(recordC);
    expect(recordAtTableRow($it, 2)).toEqual(recordD);
    expect(recordAtTableRow($it, 3)).toEqual(recordA);
  });

  it('resets on click non-field heading at left', () => {
    clickHeading($it, -1);
    expect(recordAtTableRow($it, 0)).toEqual(recordA);
    expect(recordAtTableRow($it, 1)).toEqual(recordB);
    expect(recordAtTableRow($it, 2)).toEqual(recordC);
    expect(recordAtTableRow($it, 3)).toEqual(recordD);
  });
});
