/* @flow */

import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});

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
  recordAtTableRow,
} from '../../testing/selectors';

import Table from '../Table';

describe('Table sorting', () => {
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
