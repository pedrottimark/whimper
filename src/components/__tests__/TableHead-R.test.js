/* @flow */

import React from 'react';
import renderer from 'react-test-renderer';

import {
  sortRecords,
} from '../../actions';
import {
  fieldsInitial,
  fieldsReceived as fields,
} from '../../reducers/fields';
import {viewInitial} from '../../reducers/view';

import TableHead from '../TableHead';

const addRow = () => {};

describe('TableHead', () => {
  it('renders button, count, but no fields', () => {
    expect(renderer.create(
      <TableHead
        addRow={addRow}
        count={0}
        fields={fieldsInitial}
        sortRecords={sortRecords}
        view={viewInitial}
      />
    ).toJSON()).toMatchSnapshot();
  });

  it('renders button, count, and fields', () => {
    expect(renderer.create(
      <TableHead
        addRow={addRow}
        count={7}
        fields={fields}
        sortRecords={sortRecords}
        view={viewInitial}
      />
    ).toJSON()).toMatchSnapshot();
  });
});
