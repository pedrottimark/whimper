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
  recordE,
  recordF,
  recordG,
} from '../../testing/records-data';
import {
  changeFilter,
  countRecords,
  recordAtTableRow,
} from '../../testing/selectors';

import Table from '../Table';

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
    expect(recordAtTableRow($it, 0)).toEqual(recordD);
    expect(recordAtTableRow($it, 1)).toEqual(recordG);
  });

  it('matches same rows', () => {
    changeFilter($it, '10 ');
    expect(countRecords($it)).toEqual(2);
    expect(recordAtTableRow($it, 0)).toEqual(recordD);
    expect(recordAtTableRow($it, 1)).toEqual(recordG);
  });

  it('matches even fewer rows', () => {
    changeFilter($it, '10 y');
    expect(countRecords($it)).toEqual(1);
    expect(recordAtTableRow($it, 0)).toEqual(recordD);
  });

  it('matches no rows', () => {
    changeFilter($it, '10 yr');
    expect(countRecords($it)).toEqual(0);
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
