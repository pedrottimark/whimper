import React from 'react';
import {shallow} from 'enzyme';

import {
  fieldsInitial,
  fieldsReceived as fields,
} from '../../reducers/fields';

const textAt = ($it, i) => $it.find('tr').at(1).find('th').at(1 + i).text();

import TableHead from '../TableHead';

describe('TableHead', () => {
  it('renders button, count, but no fields', () => {
    const $it = shallow(
      <TableHead
        addRow={() => {}}
        count={0}
        fields={fieldsInitial}
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
      />
    );
    expect($it.find('button').length).toBe(1); // add row
    expect($it.find('tr').at(1).find('th').at(0).text()).toBe('4');
    // and so on for field labels in column headings
    expect(textAt($it, 0)).toBe(fields[0].label);
    expect(textAt($it, 1)).toBe(fields[1].label);
    expect(textAt($it, 2)).toBe(fields[2].label);
  });
});
