/* @flow */

import type {
  Action,
  Field,
  Fields,
  FieldValue,
} from '../types';

// production app might get fields from external source :)
export const fieldsReceived: Fields = [
  {
    key: 'when',
    label: 'when',
    type: 'number',
    defaultValue: new Date().getFullYear(),
  },
  {
    key: 'what',
    label: 'what',
    type: 'text',
    defaultValue: '',
  },
  {
    key: 'weep',
    label: 'weep',
    type: 'text',
    defaultValue: '',
  },
];

// Given a field and text input value,
// return a data value to update the property in a record.
export const fieldValue = ({type}: Field, text: string): FieldValue => type === 'number'
  ? parseInt(text, 10)
  : text;

export const fieldsInitial: Fields = [];

export default function (fields: Fields = fieldsInitial, action: Action): Fields {
  switch (action.type) {

  case 'RECEIVE_DATA':
    return action.fields || fields;

  default:
    return fields;

  }
}
