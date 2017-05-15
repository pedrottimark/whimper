import {mountToShallowJson} from './enzyme-to-json';

// Selectors encapsulate traversal in non-snapshot tests to minimize change
// if there is a change to structure of markup that a component renders.

// The goal is similar to selectors for state of a Redux store.

// get values

export const countRecords = ($table) =>
  Number($table.find('thead tr').at(1).find('th').at(0).text());

export const tbodyShallow = ($table) =>
  mountToShallowJson($table.find('tbody'));

export const trShallow = ($tbodyOrHead) =>
  mountToShallowJson($tbodyOrHead.find('tr').at(1));

// set values

export const changeFilter = ($table, value) => {
  const $input = $table.find('thead input');
  $input.get(0).value = value;
  $input.simulate('change');
};

export const clickAdd = ($table) => {
  $table.find('thead tr').at(0).find('th').at(0).simulate('click');
};

export const clickDelete = ($table, rowIndex) => {
  $table.find('tbody tr').at(rowIndex).find('td').at(0).simulate('click');
};

export const clickHeading = ($table, fieldIndex) => {
  $table.find('thead tr').at(1).find('th').at(1 + fieldIndex).simulate('click');
}

export const $tdAtIndex = ($table, rowIndex, fieldIndex) =>
  $table.find('tbody tr').at(rowIndex).find('td').at(1 + fieldIndex);

// for __test0__

export const countTableRows = ($table) =>
  $table.find('TableRow').length;

export const recordAtTableRow = ($table, rowIndex) =>
  $table.find('TableRow').at(rowIndex).prop('record');

export const textAt = ($table, fieldIndex) =>
  $table.find('abbr').at(fieldIndex).text();
