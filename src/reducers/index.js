import { combineReducers } from 'redux';

// child reducers
import fields from './fields';
import records from './records';
import view from './view';

// root reducer
export default combineReducers({
  fields,
  records,
  view,
});
