import React from 'react';
import {createStore} from 'redux';
import {connect, Provider} from 'react-redux';

import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});

import {fieldsReceived as fields} from '../../reducers/fields';
import view from '../../reducers/view';
import {sortRecords} from '../../actions';
import {
  abbrAt,
  clickHeading,
} from '../../testing/selectors';

import TableHead, {
  ascending,
  descending,
} from '../TableHead';

const neutral = '';

describe('TableHead sorting indicator', () => {
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

  it('is neutral by default', () => {
    expect(abbrAt($it, 0)).toBe(neutral);
    expect(abbrAt($it, 1)).toBe(neutral);
    expect(abbrAt($it, 2)).toBe(neutral);
  });

  it('is ascending on click `what` heading', () => {
    clickHeading($it, 1);
    expect(abbrAt($it, 0)).toBe(neutral);
    expect(abbrAt($it, 1)).toBe(ascending);
    expect(abbrAt($it, 2)).toBe(neutral);
  });

  it('is descending on click `what` heading again', () => {
    clickHeading($it, 1);
    expect(abbrAt($it, 0)).toBe(neutral);
    expect(abbrAt($it, 1)).toBe(descending);
    expect(abbrAt($it, 2)).toBe(neutral);
  });

  it('is ascending on click `weep` heading', () => {
    clickHeading($it, 2);
    expect(abbrAt($it, 0)).toBe(neutral);
    expect(abbrAt($it, 1)).toBe(neutral);
    expect(abbrAt($it, 2)).toBe(ascending);
  });

  it('is ascending on click `when` heading', () => {
    clickHeading($it, 0);
    expect(abbrAt($it, 0)).toBe(ascending);
    expect(abbrAt($it, 1)).toBe(neutral);
    expect(abbrAt($it, 2)).toBe(neutral);
  });

  it('is ascending on click `weep` again after others', () => {
    clickHeading($it, 2);
    expect(abbrAt($it, 0)).toBe(neutral);
    expect(abbrAt($it, 1)).toBe(neutral);
    expect(abbrAt($it, 2)).toBe(ascending);
  });

  it('is descending on click `weep` again', () => {
    clickHeading($it, 2);
    expect(abbrAt($it, 0)).toBe(neutral);
    expect(abbrAt($it, 1)).toBe(neutral);
    expect(abbrAt($it, 2)).toBe(descending);
  });

  it('resets on click non-field heading at left', () => {
    clickHeading($it, -1);
    expect(abbrAt($it, 0)).toBe(neutral);
    expect(abbrAt($it, 1)).toBe(neutral);
    expect(abbrAt($it, 2)).toBe(neutral);
  });
});
