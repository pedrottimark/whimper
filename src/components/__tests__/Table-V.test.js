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
} from '../../testing/records-data';
import {
  clickHeading,
  tbodyShallow,
} from '../../testing/selectors';

import Table from '../Table';
const TableRow = () => {}; // mock

describe('Table sorting', () => {
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
