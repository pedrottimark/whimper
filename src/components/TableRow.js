/* @flow */

import React, {Component} from 'react';
import invariant from 'invariant';

import type {
  DeleteRecord,
  Fields,
  Record,
  Updating,
} from '../types';

type Props = {|
  deleteRecord: DeleteRecord,
  fields: Fields,
  record: Record,
  updating: Updating,
|};

class TableRow extends Component {
  props: Props;
  _input: HTMLInputElement;

  _refInput = (input: HTMLInputElement) => {
    this._input = input;
  }

  _onSubmit = (e: Event) => {
    e.preventDefault();
    invariant(this.props.updating, 'updating is defined when TableRow renders a form');
    this.props.updating.update(this._input.value);
  }

  render() {
    const {deleteRecord, fields, record, updating} = this.props;
    const recordId = record.id;
    const symbol = '\u274c'; // CROSS MARK
    return (
      <tr>
        <td key="" title="delete row" onClick={deleteRecord.bind(null, recordId)}><button>{symbol}</button></td>
        {
          fields.map(({key, type}) => {
            const value = record[key];
            return (
              <td key={key} data-record-id={recordId} data-field-key={key}>
                {
                  updating && updating.recordId === recordId && updating.fieldKey === key
                    ? <div>
                        <span>{value}</span>
                        <form onSubmit={this._onSubmit}>
                          <input ref={this._refInput} type={type} defaultValue={value} autoFocus={true} />
                        </form>
                      </div>
                    : value
                }
              </td>
            );
          })
        }
      </tr>
    );
  }
}

export default TableRow;
