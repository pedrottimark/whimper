/* @flow */

import React from 'react';
import renderer from 'react-test-renderer';

import {
  fieldsInitial,
  fieldsReceived as fields,
} from '../../reducers/fields';

import TableHead from '../TableHead';

const addRow = () => {};

describe('TableHead', () => {
  it('renders button, count, but no fields', () => {
    expect(renderer.create(
      <TableHead
        addRow={addRow}
        count={0}
        fields={fieldsInitial}
      />
    ).toJSON()).toMatchSnapshot();
  });

  it('renders button, count, and fields', () => {
    expect(renderer.create(
      <TableHead
        addRow={addRow}
        count={7}
        fields={fields}
      />
    ).toJSON()).toMatchSnapshot();
  });
});
