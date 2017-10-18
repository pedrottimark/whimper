/* @flow */

import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});
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
import {
  changeFilter,
  countRecords,
  tbodyShallow,
} from '../../testing/selectors';

import Table from '../Table';
const TableRow = () => {}; // mock, and provide only relevant props

describe('Table filtering', () => {
  const records = [recordA, recordB, recordC, recordD, recordE, recordF, recordG];
  const store = createStore(reducer);
  store.dispatch(receiveData(fields, records));
  const $it = mount(
    <Provider store={store}>
      <Table />
    </Provider>
  );

  it('matches all rows', () => {
    changeFilter($it, '1');
    expect(countRecords($it)).toEqual(records.length);
  });

  it('matches fewer rows', () => {
    changeFilter($it, '10');
    expect(countRecords($it)).toEqual(2);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordD} />
        <TableRow record={recordG} />
      </tbody>
    ));
  });

  it('matches same rows', () => {
    changeFilter($it, '10 ');
    expect(countRecords($it)).toEqual(2);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordD} />
        <TableRow record={recordG} />
      </tbody>
    ));
  });

  it('matches even fewer rows', () => {
    changeFilter($it, '10 y');
    expect(countRecords($it)).toEqual(1);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
        <TableRow record={recordD} />
      </tbody>
    ));
  });

  it('matches no rows', () => {
    changeFilter($it, '10 yr');
    expect(countRecords($it)).toEqual(0);
    expect(tbodyShallow($it)).toMatchObject(relevantTestObject(
      <tbody>
      </tbody>
    ));
  });

  it('matches all rows again', () => {
    changeFilter($it, '');
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
