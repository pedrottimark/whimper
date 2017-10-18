/* @flow */

import React, {Component} from 'react';

import type {
  FieldKey,
  Fields,
  SortRecords,
  SortingCriterion,
  View,
} from '../types';

type Props = {|
  addRow: Function,
  count: number,
  fields: Fields,
  sortRecords: SortRecords,
  view: View,
|};

export const ascending = '\u25B2'; // black up-pointing triangle
export const descending = '\u25BC'; // black down-pointing triangle

function sortingIndicator(fieldKey: FieldKey, sortingCriterion?: SortingCriterion) {
  let title = '';
  let text;
  if (sortingCriterion && sortingCriterion.fieldKey === fieldKey) {
    if (sortingCriterion.descending) {
      title = 'descending';
      text = descending;
    } else {
      title = 'ascending';
      text = ascending;
    }
  }

  return {
    title,
    text,
  };
}

class TableHead extends Component {
  props: Props;

  _addRow = () => {
    this.props.addRow();
  }

  _resortRows = () => {
    this.props.sortRecords();
  }

  render() {
    const {count, fields, sortRecords, view} = this.props;
    const addRow = '\u2795'; // HEAVY PLUS SIGN
    const sortingCriterion = view.sorting[0];
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
          <th key="" title="reset sort order" onClick={this._resortRows} scope="col">{count}</th>
          {
            fields.map(({key, label}) => {
              const {title, text} = sortingIndicator(key, sortingCriterion);
              return (
                <th key={key} onClick={() => { sortRecords(key); }} scope="col">
                  <span>{label}</span>
                  <abbr title={title}>{text}</abbr>
                </th>
              )
            })
          }
        </tr>
      </thead>
    );
  }
}

export default TableHead;
