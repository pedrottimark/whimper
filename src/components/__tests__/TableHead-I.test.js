import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});

import {fieldsReceived as fields} from '../../reducers/fields';
import {viewInitial} from '../../reducers/view';

import TableHead from '../TableHead';

describe('TableHead', () => {
  const addRow = jest.fn();
  const sortRecords = jest.fn();
  const $it = mount(
    <table>
      <TableHead
        addRow={addRow}
        count={7}
        fields={fields}
        filterRecords={() => {}}
        sortRecords={sortRecords}
        view={viewInitial}
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

  it('sorts rows', () => {
    // [] from click non-field heading at left to reset sort order.
    expect(sortRecords.mock.calls).toEqual([[]].concat(
      fields.map(({key}) => [key])
    ));
  });
});
