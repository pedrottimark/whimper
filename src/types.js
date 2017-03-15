/* @flow */

export type FieldKey = string;
export type FieldType = 'number' | 'text';
export type FieldValue = number | string;
export type Field = {|
  key: FieldKey,
  label: string,
  type: FieldType,
  defaultValue: FieldValue,
|};
export type Fields = Array<Field>;

export type RecordId = number;
export type Record = {
  id: RecordId,
};
export type Records = Array<Record>;

export type FilteringCriterion = string;
export type SortingCriterion = {|
  fieldKey: FieldKey,
  descending: boolean,
|};
export type SortingCriteria = Array<SortingCriterion>;

export type View = {|
  filtering: FilteringCriterion,
  sorting: SortingCriteria,
|};

export type AppState = {|
  fields: Fields,
  records: Records,
  view: View,
|};

export type Updating = {
  recordId: RecordId,
  fieldKey: FieldKey,
  update: (text: string) => void,
} | null;

// action creators

export type CreateRecordAction = {
  type: 'CREATE_RECORD',
  record: Record,
};
export type CreateRecord = (record: Record) => CreateRecordAction;

export type ReceiveDataAction = {
  type: 'RECEIVE_DATA',
  fields: Fields,
  records?: Records,
};
export type ReceiveData = (fields: Fields, records?: Records) => ReceiveDataAction;

export type UpdateFieldAction = {
  type: 'UPDATE_FIELD',
  recordId: RecordId,
  fieldKey: FieldKey,
  value: FieldValue,
};
export type UpdateField = (recordId: RecordId, fieldKey: FieldKey, value: FieldValue) => UpdateFieldAction;

export type DeleteRecordAction = {
  type: 'DELETE_RECORD',
  recordId: RecordId,
};
export type DeleteRecord = (recordId: RecordId) => DeleteRecordAction;

export type FilterRecordsAction = {
  type: 'SEARCH_RECORDS',
  filtering: FilteringCriterion,
};
export type FilterRecords = (filtering: FilteringCriterion) => FilterRecordsAction;

export type SortRecordsAction = {
  type: 'SORT_RECORDS',
  fieldKey?: FieldKey,
};
export type SortRecords = (fieldKey?: FieldKey) => SortRecordsAction;

export type Action = CreateRecordAction | ReceiveDataAction | UpdateFieldAction | DeleteRecordAction | FilterRecordsAction | SortRecordsAction;
