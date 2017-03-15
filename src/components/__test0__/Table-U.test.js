/* @flow */

import React from 'react';
import {mount} from 'enzyme';
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
    expect($td.find('span').at(0).text()).toBe(String(numberInitial));
    expect($td.find('input').at(0).props()).toMatchObject({
      defaultValue: numberInitial,
      type: 'number',
    });

    const input = $td.find('input').get(0);
    invariant(parseInt(input.value, 10) === numberInitial, 'cell consistent with record');

    const numberUpdated = numberInitial + 1;
    input.value = String(numberUpdated);

    $td.find('form').simulate('submit');
    expect($td.text()).toBe(String(numberUpdated));
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
    expect($td.find('span').at(0).text()).toBe(textInitial);
    expect($td.find('input').at(0).props()).toMatchObject({
      defaultValue: textInitial,
      type: 'text',
    });

    const textUpdated = 'ECMAScript 2015';
    $td.find('input').get(0).value = textUpdated;

    $td.find('form').simulate('submit');
    expect($td.text()).toBe(textUpdated);
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
    const prev = $td.text();
    const td = $td.get(0);
    if (!td.dataset) {
      // Make up for limitation of jsdom
      td.dataset = {
        recordId: td.getAttribute('data-record-id'),
        fieldKey: td.getAttribute('data-field-key'),
      };
    }
    $td.simulate('doubleClick');

    $td.find('input').simulate('doubleClick');
    expect($td.text()).toBe(prev);
  });
});
