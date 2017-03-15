import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import App from './components/App';
import { readData, writeRecords } from './storage';

ReactDOM.render(
  <App readData={readData} writeRecords={writeRecords} />,
  document.getElementById('root')
);
