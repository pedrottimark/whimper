/* @flow */

import React from 'react';
import {mount} from 'enzyme';
import {mountToShallowObject} from '../../testing/enzyme-to-json';
import {relevantTestObject} from '../../testing/relevant-test-object';
import invariant from 'invariant';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {receiveData,} from '../../actions';
import reducer from '../../reducers';
import {fieldsReceived as fields} from '../../reducers/fields';
import {recordA, recordB, recordC, recordD} from '../../testing/records-data';

const records = [recordA, recordB, recordC, recordD];

import Table from '../Table';

const $tdAtIndex = ($it, rowIndex, fieldIndex) =>
  $it.find('tbody tr').at(rowIndex).find('td').at(1 + fieldIndex);

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
    const $td = $tdAtIndex($it, rowIndex, fieldIndex);

    const td = $td.get(0);
    if (!td.dataset) {
      // Make up for limitation of jsdom
      td.dataset = {
        recordId: td.getAttribute('data-record-id'),
        fieldKey: td.getAttribute('data-field-key'),
      };
    }
    $td.simulate('doubleClick');

    const numberInitial = records[rowIndex][fields[fieldIndex].key];
    expect(mountToShallowObject($td)).toMatchObject(relevantTestObject(
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

    const input = $td.find('input').get(0);
    invariant(parseInt(input.value, 10) === numberInitial, 'cell consistent with record');

    const numberUpdated = numberInitial + 1;
    input.value = numberUpdated.toString();

    $td.find('form').simulate('submit');
    expect(mountToShallowObject($td)).toMatchObject(relevantTestObject(
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
    const $td = $tdAtIndex($it, rowIndex, fieldIndex);

    const td = $td.get(0);
    if (!td.dataset) {
      // Make up for limitation of jsdom
      td.dataset = {
        recordId: td.getAttribute('data-record-id'),
        fieldKey: td.getAttribute('data-field-key'),
      };
    }
    $td.simulate('doubleClick');

    const textInitial = records[rowIndex][fields[fieldIndex].key];
    expect(mountToShallowObject($td)).toMatchObject(relevantTestObject(
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

    const input = $td.find('input').get(0);
    const textUpdated = 'ECMAScript 2015';
    input.value = textUpdated;

    $td.find('form').simulate('submit');
    expect(mountToShallowObject($td)).toMatchObject(relevantTestObject(
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
    const $td = $tdAtIndex($it, rowIndex, fieldIndex);
    const td = $td.get(0);
    if (!td.dataset) {
      // Make up for limitation of jsdom
      td.dataset = {
        recordId: td.getAttribute('data-record-id'),
        fieldKey: td.getAttribute('data-field-key'),
      };
    }
    const prev = mountToShallowObject($td);
    $td.simulate('doubleClick');

    $td.find('input').simulate('doubleClick');
    const next = mountToShallowObject($td);
    expect(next).toEqual(prev);
  });
});
