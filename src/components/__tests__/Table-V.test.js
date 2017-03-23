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
import {
  recordA,
  recordB,
  recordC,
  recordD,
  recordE,
  recordF,
  recordG,
} from '../../testing/records-data';

import Table from '../Table';
const TableRow = () => {}; // mock

const tbodyShallow = ($it) => mountToShallowObject($it.find('tbody'));

describe('Table filtering', () => {
  const changeFilter = ($input, value) => {
    $input.get(0).value = value;
    $input.simulate('change');
  };
  const countRecords = ($it) => Number($it.find('thead tr').at(1).find('th').at(0).text());

  const records = [recordA, recordB, recordC, recordD, recordE, recordF, recordG];
  const store = createStore(reducer);
  store.dispatch(receiveData(fields, records));
  const $it = mount(
    <Provider store={store}>
      <Table />
    </Provider>
  );
  const $input = $it.find('thead input');

  it('matches all rows', () => {
    changeFilter($input, '1');
    expect(countRecords($it)).toEqual(records.length);
  });

  it('matches fewer rows', () => {
    changeFilter($input, '10');
    expect(countRecords($it)).toEqual(2);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordD} />
        <TableRow record={recordG} />
      </tbody>
    ));
  });

  it('matches same rows', () => {
    changeFilter($input, '10 ');
    expect(countRecords($it)).toEqual(2);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordD} />
        <TableRow record={recordG} />
      </tbody>
    ));
  });

  it('matches even fewer rows', () => {
    changeFilter($input, '10 y');
    expect(countRecords($it)).toEqual(1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordD} />
      </tbody>
    ));
  });

  it('matches no rows', () => {
    changeFilter($input, '10 yr');
    expect(countRecords($it)).toEqual(0);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
      </tbody>
    ));
  });

  it('matches all rows again', () => {
    changeFilter($input, '');
    expect(countRecords($it)).toEqual(records.length);
  });
});

describe('Table sorting', () => {
  const clickHeading = ($it, i) => {
    $it.find('thead tr').at(1).find('th').at(1 + i).simulate('click');
  };

  const records = [recordA, recordB, recordC, recordD];
  const store = createStore(reducer);
  store.dispatch(receiveData(fields, records));
  const $it = mount(
    <Provider store={store}>
      <Table />
    </Provider>
  );

  it('is ascending on click `what` heading', () => {
    clickHeading($it, 1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordA} />
        <TableRow record={recordD} />
        <TableRow record={recordC} />
        <TableRow record={recordB} />
      </tbody>
    ));
  });

  it('is descending on click `what` heading again', () => {
    clickHeading($it, 1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordB} />
        <TableRow record={recordC} />
        <TableRow record={recordD} />
        <TableRow record={recordA} />
      </tbody>
    ));
  });

  it('resets on click non-field heading at left', () => {
    clickHeading($it, -1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordA} />
        <TableRow record={recordB} />
        <TableRow record={recordC} />
        <TableRow record={recordD} />
      </tbody>
    ));
  });
});
