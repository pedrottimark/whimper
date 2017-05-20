import React from 'react';
import {createRenderer} from 'react-test-renderer/shallow';
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

import {Table} from '../Table'; // unconnected component

// Demonstrate that relevantTestObject is relevant (pardon pun :)
// to shallow renderer from react-test-renderer package.
const tableShallow = (store) => {
  const shallow = createRenderer();

  // Omit props whose values are callback functions.
  shallow.render(<Table {...store.getState()} />);

  // Return test object which has $$typeof, type, props, children;
  // but none of the following from React element: key, ref, _owner, _store
  return relevantTestObject(shallow.getRenderOutput());
};

// mock, and provide only relevant props
const TableHead = () => {};
const TableRow = () => {};

describe('Table', () => {
  it('renders initial empty fields and records', () => {
    const store = createStore(reducer);

    expect(tableShallow(store)).toMatchObject(relevantTestObject(
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

    expect(tableShallow(store)).toMatchObject(relevantTestObject(
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

    expect(tableShallow(store)).toMatchObject(relevantTestObject(
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
