/* @flow */

import React from 'react';
import {mount} from 'enzyme';
import {mountToShallowObject} from '../../testing/enzyme-to-json';
import {relevantTestObject} from '../../testing/relevant-test-object';

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
const TableRow = () => {}; // mock

const tbodyShallow = ($it) => mountToShallowObject($it.find('tbody'));

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
