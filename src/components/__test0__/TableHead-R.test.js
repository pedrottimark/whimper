import React from 'react';
import {shallow} from 'enzyme';

import {
  fieldsInitial,
  fieldsReceived as fields,
} from '../../reducers/fields';
import {viewInitial} from '../../reducers/view';
import {
  labelAt,
} from '../../testing/selectors';

import TableHead, {
  ascending,
  descending,
} from '../TableHead';

describe('TableHead', () => {
  it('renders button, count, but no fields', () => {
    const $it = shallow(
      <TableHead
        addRow={() => {}}
        count={0}
        fields={fieldsInitial}
        sortRecords={() => {}}
        view={viewInitial}
      />
    );
    expect($it.find('button').length).toBe(1); // add row
    expect($it.find('tr').at(1).find('th').at(0).text()).toBe('0');
  });

  it('renders button, count, and fields', () => {
    const $it = shallow(
      <TableHead
        addRow={() => {}}
        count={4}
        fields={fields}
        sortRecords={() => {}}
        view={viewInitial}
      />
    );
    expect($it.find('button').length).toBe(1); // add row
    expect($it.find('tr').at(1).find('th').at(0).text()).toBe('4');
    // and so on for field labels in column headings
    expect(labelAt($it, 0)).toBe(fields[0].label);
    expect(labelAt($it, 1)).toBe(fields[1].label);
    expect(labelAt($it, 2)).toBe(fields[2].label);
  });

  it('renders ascending indicator in `what` heading', () => {
    const $it = shallow(
      <TableHead
        addRow={() => {}}
        count={3}
        fields={fields}
        sortRecords={() => {}}
        view={Object.assign({}, viewInitial, {
          sorting: [
            {
              fieldKey: 'what',
              descending: false,
            },
          ]
        })}
      />
    );
    const $abbr = $it.find('tr').at(1).find('abbr').at(1);
    expect($abbr.prop('title')).toBe('ascending');
    expect($abbr.text()).toBe(ascending);
    // and so on for headings where indicator is not expected
  });

  it('renders descending indicator in `when` heading', () => {
    const $it = shallow(
      <TableHead
        addRow={() => {}}
        count={3}
        fields={fields}
        sortRecords={() => {}}
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
    );

    const $abbr = $it.find('tr').at(1).find('abbr').at(0);
    expect($abbr.prop('title')).toBe('descending');
    expect($abbr.text()).toBe(descending);
    // and so on for headings where indicator is not expected
  });
});
