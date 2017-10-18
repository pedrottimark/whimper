/* @flow */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import invariant from 'invariant';

import {
  createRecord,
  deleteRecord,
  sortRecords,
  updateField,
} from '../actions';

import {fieldValue} from '../reducers/fields';
import {recordDefault} from '../reducers/records';
import {recordsInView} from '../reducers/view';

import type {
  AppState,
  Fields,
  Records,
  CreateRecord,
  DeleteRecord,
  SortRecords,
  UpdateField,
  Updating,
  View,
} from '../types';

import './Table.css';

import TableHead from './TableHead';
import TableRow from './TableRow';

type Props = {|
  fields: Fields,
  records: Records,
  view: View,
  createRecord: CreateRecord,
  deleteRecord: DeleteRecord,
  sortRecords: SortRecords,
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
    // Get attributes because no dataset property in jsdom 10 and earlier
    const unparsedId = target.getAttribute('data-record-id');
    const fieldKey = target.getAttribute('data-field-key');
    console.log(target.nodeName, unparsedId, fieldKey);
    if (unparsedId !== null && fieldKey !== null) {
      // Double-click a data cell to display an input box.
      const recordId = parseInt(unparsedId, 10);
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
    const {deleteRecord, fields, records, sortRecords, view} = this.props;
    const recordsFilteredSorted = recordsInView(records, fields, view);
    const {updating} = this.state;
    return (
      <table>
        <TableHead
          addRow={this._addRow}
          count={recordsFilteredSorted.length}
          fields={fields}
          sortRecords={sortRecords}
          view={view}
        />
        <tbody onDoubleClick={this._updating}>
          {
            recordsFilteredSorted.map(record => (
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
const mapStateToProps = ({fields, records, view}: AppState) => ({
  fields,
  records,
  view,
});

const mapDispatchToProps = {
  createRecord,
  deleteRecord,
  sortRecords,
  updateField,
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
