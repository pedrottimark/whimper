/* @flow */

import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});

import {fieldsReceived} from '../../reducers/fields';
import {recordA, recordB, recordC, recordD} from '../../testing/records-data';

const recordsReceived = [recordA, recordB, recordC, recordD];

import App from '../App';

describe('App', () => {
  it('renders initial data without crashing', () => {
    const readData = jest.fn(callback => {
      callback();
    });
    const writeRecords = jest.fn();
    mount(
      <App readData={readData} writeRecords={writeRecords} />
    );

    expect(readData).toHaveBeenCalledTimes(1);
    expect(writeRecords).toHaveBeenCalledTimes(0);
  });

  it('renders received data without crashing', () => {
    const readData = jest.fn((callback) => {
      callback(fieldsReceived, recordsReceived);
    });
    const writeRecords = jest.fn();
    mount(
      <App readData={readData} writeRecords={writeRecords} />
    );

    expect(readData).toHaveBeenCalledTimes(1);
    expect(writeRecords).toHaveBeenCalledTimes(1);
    expect(writeRecords).toHaveBeenCalledWith(recordsReceived);
  });

  it('calls componentWillUnmount without crashing', () => {
    const readData = jest.fn((callback) => {
      callback(fieldsReceived, recordsReceived);
    });
    const writeRecords = jest.fn();
    const $it = mount(
      <App readData={readData} writeRecords={writeRecords} />
    );
    $it.unmount();
  });
});
