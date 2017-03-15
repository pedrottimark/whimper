import React from 'react';
import {mount} from 'enzyme';

import {fieldsReceived as fields} from '../../reducers/fields';

import TableHead from '../TableHead';

describe('TableHead', () => {
  const addRow = jest.fn();
  const $it = mount(
    <table>
      <TableHead
        addRow={addRow}
        count={7}
        fields={fields}
      />
    </table>
  );

  // Click every cell in table head
  $it.find('thead tr').forEach($tr => {
    $tr.find('th').forEach($th => {
      $th.simulate('click');
    });
  });

  // Interface events cause correct actions.

  it('adds a row', () => {
    expect(addRow).toHaveBeenCalledTimes(1);
    expect(addRow).toHaveBeenCalledWith();
  });
});
