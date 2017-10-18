/* @flow */

import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});
import toJson from 'enzyme-to-json';
import {relevantTestObject} from '../../testing/react-test-renderer';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {
  receiveData,
} from '../../actions';
import reducer from '../../reducers';
import {
  fieldsReceived,
} from '../../reducers/fields';
import {
  recordB,
  recordC,
  recordD,
} from '../../testing/records-data';

import Table from '../Table';

const tableShallow = (element) => toJson(mount(element).find('table'), {mode: 'shallow'});
const TableHead = () => {};
const TableRow = () => {};

describe('Table', () => {
  it('renders initial empty fields and records', () => {
    const store = createStore(reducer);

    expect(tableShallow(
      <Provider store={store}>
        <Table />
      </Provider>
    )).toMatchObject(relevantTestObject(
      <table>
        <TableHead count={0} fields={[]} />
        <tbody>
        </tbody>
      </table>
    ));
  });

  it('renders received fields and zero count of records', () => {
    const recordsReceived = [];
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived, recordsReceived));

    expect(tableShallow(
      <Provider store={store}>
        <Table />
      </Provider>
    )).toMatchObject(relevantTestObject(
      <table>
        <TableHead count={recordsReceived.length} fields={fieldsReceived} />
        <tbody>
        </tbody>
      </table>
    ));
  });

  it('renders received fields and non-zero count of records', () => {
    const recordsReceived = [recordB, recordC, recordD];
    const store = createStore(reducer);
    store.dispatch(receiveData(fieldsReceived, recordsReceived));

    expect(tableShallow(
      <Provider store={store}>
        <Table />
      </Provider>
    )).toMatchObject(relevantTestObject(
      <table>
        <TableHead count={recordsReceived.length} fields={fieldsReceived} />
        <tbody>
          <TableRow fields={fieldsReceived} record={recordB} />
          <TableRow fields={fieldsReceived} record={recordC} />
          <TableRow fields={fieldsReceived} record={recordD} />
        </tbody>
      </table>
    ));
  });
});
