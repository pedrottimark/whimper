/* @flow */

import React from 'react';
import renderer from 'react-test-renderer';
import {
  irrelevant,
  relevantTestObject,
  renderAsTestObject,
} from '../../testing/relevant-test-object';

import {
  sortRecords,
} from '../../actions';
import {
  fieldsInitial,
  fieldsReceived as fields,
} from '../../reducers/fields';
import {viewInitial} from '../../reducers/view';

import TableHead, {
  ascending,
  descending,
} from '../TableHead';

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

  it('renders ascending indicator in `what` heading', () => {
    expect(renderAsTestObject(
      <TableHead
        addRow={addRow}
        count={7}
        fields={fields}
        sortRecords={sortRecords}
        view={Object.assign({}, viewInitial, {
          sorting: [
            {
              fieldKey: 'what',
              descending: false,
            },
          ]
        })}
      />
    ).children[1]).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th>
          <span>{irrelevant}</span>
          <abbr title=""></abbr>
        </th>
        <th>
          <span>{irrelevant}</span>
          <abbr title="ascending">{ascending}</abbr>
        </th>
        <th>
          <span>{irrelevant}</span>
          <abbr title=""></abbr>
        </th>
      </tr>
    ));
  });

  it('renders descending indicator in `when` heading', () => {
    expect(renderAsTestObject(
      <TableHead
        addRow={addRow}
        count={7}
        fields={fields}
        sortRecords={sortRecords}
        view={Object.assign({}, viewInitial, {
          sorting: [
            {
              fieldKey: 'when',
              descending: true,
            },
            {
              fieldKey: 'what',
              descending: false,
            },
          ]
        })}
      />
    ).children[1]).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th>
          <span>{irrelevant}</span>
          <abbr title="descending">{descending}</abbr>
        </th>
        <th>
          <span>{irrelevant}</span>
          <abbr title=""></abbr>
        </th>
        <th>
          <span>{irrelevant}</span>
          <abbr title=""></abbr>
        </th>
      </tr>
    ));
  });
});
