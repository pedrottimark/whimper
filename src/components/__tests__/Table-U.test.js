/* @flow */

import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});
import toJson from 'enzyme-to-json';
const toDeepJson = wrapper => toJson(wrapper, {mode: 'deep'});
import {relevantTestObject} from '../../testing/react-test-renderer';
import invariant from 'invariant';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {receiveData,} from '../../actions';
import reducer from '../../reducers';
import {fieldsReceived as fields} from '../../reducers/fields';
import {
  recordA,
  recordB,
  recordC,
  recordD,
} from '../../testing/records-data';
import {
  $tdAtIndex,
} from '../../testing/selectors';

const records = [recordA, recordB, recordC, recordD];

import Table from '../Table';

describe('Table', () => {
  it('updates a number field', () => {
    const store = createStore(reducer);
    store.dispatch(receiveData(fields, records));
    const $it = mount(
      <Provider store={store}>
        <Table />
      </Provider>
    );

    const rowIndex = 2;
    const fieldIndex = 0;
    const field = fields[fieldIndex];
    invariant(field.type === 'number', 'testing a number field');
    const numberInitial = records[rowIndex][field.key];
    const $tdInitial = $tdAtIndex($it, rowIndex, fieldIndex);
    $tdInitial.simulate('doubleClick');

    const $tdUpdating = $tdAtIndex($it, rowIndex, fieldIndex);
    expect(toDeepJson($tdUpdating)).toMatchObject(relevantTestObject(
      <td>
        <div>
          <span>{numberInitial}</span>
          <form>
            <input
              defaultValue={numberInitial}
              type="number"
            />
          </form>
        </div>
      </td>
    ));

    const input = $tdUpdating.find('input').getDOMNode();
    invariant(parseInt(input.value, 10) === numberInitial, 'cell consistent with record');

    const numberUpdated = numberInitial + 1;
    input.value = numberUpdated.toString();
    $tdUpdating.find('form').simulate('submit');

    const $tdUpdated = $tdAtIndex($it, rowIndex, fieldIndex);
    expect(toDeepJson($tdUpdated)).toMatchObject(relevantTestObject(
      <td>{numberUpdated}</td>
    ));
  });

  it('updates a text field', () => {
    const store = createStore(reducer);
    store.dispatch(receiveData(fields, records));
    const $it = mount(
      <Provider store={store}>
        <Table />
      </Provider>
    );

    const rowIndex = 2;
    const fieldIndex = 1;
    const field = fields[fieldIndex];
    invariant(field.type === 'text', 'testing a text field');
    const textInitial = records[rowIndex][field.key];
    const $tdInitial = $tdAtIndex($it, rowIndex, fieldIndex);
    $tdInitial.simulate('doubleClick');

    const $tdUpdating = $tdAtIndex($it, rowIndex, fieldIndex);
    expect(toDeepJson($tdUpdating)).toMatchObject(relevantTestObject(
      <td>
        <div>
          <span>{textInitial}</span>
          <form>
            <input
              defaultValue={textInitial}
              type="text"
            />
          </form>
        </div>
      </td>
    ));

    const textUpdated = 'ECMAScript 2015';
    $tdUpdating.find('input').getDOMNode().value = textUpdated;
    $tdUpdating.find('form').simulate('submit');

    const $tdUpdated = $tdAtIndex($it, rowIndex, fieldIndex);
    expect(toDeepJson($tdUpdated)).toMatchObject(relevantTestObject(
      <td>{textUpdated}</td>
    ));
  });

  it('cancels updating if people double-click the input', () => {
    const store = createStore(reducer);
    store.dispatch(receiveData(fields, records));
    const $it = mount(
      <Provider store={store}>
        <Table />
      </Provider>
    );

    const rowIndex = 2;
    const fieldIndex = 1;
    const $tdInitial = $tdAtIndex($it, rowIndex, fieldIndex);
    const objectInitial = toDeepJson($tdInitial);
    $tdInitial.simulate('doubleClick');

    const $tdUpdating = $tdAtIndex($it, rowIndex, fieldIndex);
    $tdUpdating.find('input').simulate('doubleClick');

    const $tdCanceled = $tdAtIndex($it, rowIndex, fieldIndex);
    const objectCanceled = toDeepJson($tdCanceled);
    expect(objectCanceled).toEqual(objectInitial);
  });
});
