/* @flow */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import invariant from 'invariant';

import {
  createRecord,
  deleteRecord,
  updateField,
} from '../actions';

import {fieldValue} from '../reducers/fields';
import {recordDefault} from '../reducers/records';

import type {
  AppState,
  Fields,
  Records,
  CreateRecord,
  DeleteRecord,
  UpdateField,
  Updating,
} from '../types';

import './Table.css';

import TableHead from './TableHead';
import TableRow from './TableRow';

type Props = {|
  fields: Fields,
  records: Records,
  createRecord: CreateRecord,
  deleteRecord: DeleteRecord,
  updateField: UpdateField,
|};

type State = {
  updating: Updating,
};

export class Table extends Component {
  props: Props;
  state: State = {
    updating: null
  };

  _addRow = () => {
    this.props.createRecord(recordDefault(this.props.fields, this.props.records));
  }

  _updating = (e: Event) => {
    const target = ((e.target: any): HTMLElement);
    if (target.dataset) {
      // Double-click a data cell to display an input box.
      const recordId = parseInt(target.dataset.recordId, 10);
      const fieldKey = target.dataset.fieldKey;
      this.setState({
        updating: {
          recordId,
          fieldKey,
          update: this._update,
        },
      });
    } else {
      // Double-click the input box to cancel updating a field value.
      this.setState({
        updating: null,
      });
    }
  }

  // Press enter or return to update a field value.
  _update = (text: string) => {
    invariant(this.state.updating, 'updating is defined when TableRow calls this function');
    const {fieldKey, recordId} = this.state.updating;
    const field = this.props.fields.find(({ key }) => key === fieldKey);
    invariant(field, 'field key corresponds to updated table cell');
    this.props.updateField(
      recordId,
      fieldKey,
      fieldValue(field, text),
    );
    this.setState({
      updating: null,
    });
  }

  render() {
    const {deleteRecord, fields, records} = this.props;
    const {updating} = this.state;
    return (
      <table>
        <TableHead
          addRow={this._addRow}
          count={records.length}
          fields={fields}
        />
        <tbody onDoubleClick={this._updating}>
          {
            records.map(record => (
              <TableRow
                key={record.id}
                deleteRecord={deleteRecord}
                fields={fields}
                record={record}
                updating={updating}
              />
            ))
          }
        </tbody>
      </table>
    );
  }
}

// A container component subscribes to relevant parts of state in the Redux store.
const mapStateToProps = ({fields, records}: AppState) => ({
  fields,
  records,
});

const mapDispatchToProps = {
  createRecord,
  deleteRecord,
  updateField,
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
