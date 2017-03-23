import React from 'react';
import {createStore} from 'redux';
import {connect, Provider} from 'react-redux';

import {mount} from 'enzyme';
import {mountToShallowObject} from '../../testing/enzyme-to-json';
import {irrelevant, relevantTestObject} from '../../testing/react-test-renderer';

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
  const trShallow = ($it) => mountToShallowObject($it.find('tr').at(1));

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
    expect(trShallow($it)).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr /></th>
      </tr>
    ));
  });

  it('is ascending on click `what` heading', () => {
    clickHeading($it, 1);
    expect(trShallow($it)).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr>{ascending}</abbr></th>
        <th><span>{irrelevant}</span><abbr /></th>
      </tr>
    ));
  });

  it('is descending on click `what` heading again', () => {
    clickHeading($it, 1);
    expect(trShallow($it)).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr>{descending}</abbr></th>
        <th><span>{irrelevant}</span><abbr /></th>
      </tr>
    ));
  });

  it('is ascending on click `weep` heading', () => {
    clickHeading($it, 2);
    expect(trShallow($it)).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr>{ascending}</abbr></th>
      </tr>
    ));
  });

  it('is ascending on click `when` heading', () => {
    clickHeading($it, 0);
    expect(trShallow($it)).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th><span>{irrelevant}</span><abbr>{ascending}</abbr></th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr /></th>
      </tr>
    ));
  });

  it('is ascending on click `weep` again after others', () => {
    clickHeading($it, 2);
    expect(trShallow($it)).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr>{ascending}</abbr></th>
      </tr>
    ));
  });

  it('is descending on click `weep` again', () => {
    clickHeading($it, 2);
    expect(trShallow($it)).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr>{descending}</abbr></th>
      </tr>
    ));
  });

  it('resets on click non-field heading at left', () => {
    clickHeading($it, -1);
    expect(trShallow($it)).toMatchObject(relevantTestObject(
      <tr>
        <th>{irrelevant}</th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr /></th>
        <th><span>{irrelevant}</span><abbr /></th>
      </tr>
    ));
  });
});
