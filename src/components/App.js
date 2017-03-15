import React, {Component} from 'react';

import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {receiveData} from '../actions';
import reducer from '../reducers';

import './App.css';

import Header from './Header';
import Table from './Table';

// Redux is a predictable state container for JavaScript apps.
const store = createStore(reducer);

class App extends Component {
  componentDidMount() {
    const {readData, writeRecords} = this.props;

    // Write records whenever they have changes.
    let {records: recordsPrev} = store.getState();
    this.unsubscribe = store.subscribe(() => {
      const {records} = store.getState();
      // Can test for changes by strict inequality because state is immutable :)
      if (recordsPrev !== records) {
        writeRecords(records);
        recordsPrev = records;
      }
    });

    readData((fields, records) => {
      store.dispatch(receiveData(fields, records));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div id="whimper">
        <Header />
        <Table />
      </div>
    );
  }
}

// Factor out storage functions so test can mock them easily.

export default ({readData, writeRecords}) => (
  <Provider store={store}>
    <App readData={readData} writeRecords={writeRecords} />
  </Provider>
);
