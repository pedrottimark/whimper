import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});

import {
  fieldsInitial,
  fieldsReceived as fields,
} from '../../reducers/fields';
import {
  labelAt,
} from '../../testing/selectors';

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
    expect(labelAt($it, 0)).toBe(fields[0].label);
    expect(labelAt($it, 1)).toBe(fields[1].label);
    expect(labelAt($it, 2)).toBe(fields[2].label);
  });
});
