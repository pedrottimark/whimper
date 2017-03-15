/* @flow */

import type {
  CreateRecord,
  ReceiveData,
  UpdateField,
  DeleteRecord,
  FilterRecords,
  SortRecords,
} from './types';

// Action creators related to data: the so-called CRUD operations.

export const createRecord: CreateRecord = (record) => ({
  type: 'CREATE_RECORD',
  record,
});

export const receiveData: ReceiveData = (fields, records) => ({
  type: 'RECEIVE_DATA',
  fields,
  records,
});

export const updateField: UpdateField = (recordId, fieldKey, value) => ({
  type: 'UPDATE_FIELD',
  recordId,
  fieldKey,
  value,
});

export const deleteRecord: DeleteRecord = (recordId) => ({
  type: 'DELETE_RECORD',
  recordId,
});

// Action creators related to view.

export const filterRecords: FilterRecords = (filtering) => ({
  type: 'SEARCH_RECORDS',
  filtering,
});

export const sortRecords: SortRecords = (fieldKey) => ({
  type: 'SORT_RECORDS',
  fieldKey,
});
