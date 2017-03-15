/* @flow */

import React from 'react';
import renderer from 'react-test-renderer';
import invariant from 'invariant';

import {fieldsReceived} from '../../reducers/fields';
import {recordA as record} from '../../testing/records-data';

import TableRow from '../TableRow';

describe('TableRow', () => {
  it('renders a record', () => {
    const updating = null;

    expect(renderer.create(
      <TableRow
        deleteRecord={jest.fn()}
        fields={fieldsReceived}
        record={record}
        updating={updating}
      />
    ).toJSON()).toMatchSnapshot();
  });

  it('renders a record updating a number field', () => {
    const field = fieldsReceived[0];
    invariant(field.type === 'number', 'testing a number field');
    const updating = {
      recordId: record.id,
      fieldKey: field.key,
      update: jest.fn(),
    };

    expect(renderer.create(
      <TableRow
        deleteRecord={jest.fn()}
        fields={fieldsReceived}
        record={record}
        updating={updating}
      />
    ).toJSON()).toMatchSnapshot();
  });

  it('renders a record updating a text field', () => {
    const field = fieldsReceived[1];
    invariant(field.type === 'text', 'testing a text field');
    const updating = {
      recordId: record.id,
      fieldKey: field.key,
      update: jest.fn(),
    };

    expect(renderer.create(
      <TableRow
        deleteRecord={jest.fn()}
        fields={fieldsReceived}
        record={record}
        updating={updating}
      />
    ).toJSON()).toMatchSnapshot();
  });
});
