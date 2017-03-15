/* @flow */

import React, {Component} from 'react';

import type {
  FieldKey,
  Fields,
} from '../types';

type Props = {|
  addRow: Function,
  count: number,
  fields: Fields,
|};

class TableHead extends Component {
  props: Props;

  _addRow = () => {
    this.props.addRow();
  }

  render() {
    const {count, fields} = this.props;
    const addRow = '\u2795'; // HEAVY PLUS SIGN
    return (
      <thead>
        <tr key="interaction">
          <th key="" scope="col" title="add row" onClick={this._addRow}>
            <button>{addRow}</button>
          </th>
          {
            fields.length !== 0 && (
              <th key="colgroup" scope="colgroup" colSpan={fields.length} />
            )
          }
        </tr>
        <tr key="headings">
          <th key="" scope="col">{count}</th>
          {
            fields.map(({key, label}) => (
              <th key={key} scope="col">{label}</th>
            ))
          }
        </tr>
      </thead>
    );
  }
}

export default TableHead;
