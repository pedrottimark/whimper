import React from 'react';
import {createStore} from 'redux';
import {connect, Provider} from 'react-redux';

import {mount} from 'enzyme';

import {fieldsReceived as fields} from '../../reducers/fields';
import view from '../../reducers/view';
import {sortRecords} from '../../actions';

import TableHead, {
  ascending,
  descending,
} from '../TableHead';

describe('TableHead sorting indicator', () => {
  const clickHeading = ($it, i) => {
    $it.find('tr').at(1).find('th').at(1 + i).simulate('click');
  }
  const textAt = ($it, i) => $it.find('abbr').at(i).text();

  const Connected = connect(
    state => ({
      view: state
    }),
    {
      sortRecords,
    },
  )(TableHead);
  const $it = mount(
    <Provider store={createStore(view)}>
      <table>
        <Connected
          addRow={() => {}}
          count={4}
          fields={fields}
        />
      </table>
    </Provider>
  );

  it('is empty by default', () => {
    expect(textAt($it, 0)).toBe('');
    expect(textAt($it, 1)).toBe('');
    expect(textAt($it, 2)).toBe('');
  });

  it('is ascending on click `what` heading', () => {
    clickHeading($it, 1);
    expect(textAt($it, 0)).toBe('');
    expect(textAt($it, 1)).toBe(ascending);
    expect(textAt($it, 2)).toBe('');
  });

  it('is descending on click `what` heading again', () => {
    clickHeading($it, 1);
    expect(textAt($it, 0)).toBe('');
    expect(textAt($it, 1)).toBe(descending);
    expect(textAt($it, 2)).toBe('');
  });

  it('is ascending on click `weep` heading', () => {
    clickHeading($it, 2);
    expect(textAt($it, 0)).toBe('');
    expect(textAt($it, 1)).toBe('');
    expect(textAt($it, 2)).toBe(ascending);
  });

  it('is ascending on click `when` heading', () => {
    clickHeading($it, 0);
    expect(textAt($it, 0)).toBe(ascending);
    expect(textAt($it, 1)).toBe('');
    expect(textAt($it, 2)).toBe('');
  });

  it('is ascending on click `weep` again after others', () => {
    clickHeading($it, 2);
    expect(textAt($it, 0)).toBe('');
    expect(textAt($it, 1)).toBe('');
    expect(textAt($it, 2)).toBe(ascending);
  });

  it('is descending on click `weep` again', () => {
    clickHeading($it, 2);
    expect(textAt($it, 0)).toBe('');
    expect(textAt($it, 1)).toBe('');
    expect(textAt($it, 2)).toBe(descending);
  });

  it('resets on click non-field heading at left', () => {
    clickHeading($it, -1);
    expect(textAt($it, 0)).toBe('');
    expect(textAt($it, 1)).toBe('');
    expect(textAt($it, 2)).toBe('');
  });
});
