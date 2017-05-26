/* @flow */

import React, {Component} from 'react';

import './Header.css';

class Header extends Component {
  render() {
    return (
      <header>
        <span role="img" aria-label="crying face">😢</span>
        <h1>whimper</h1>
      </header>
    );
  }
}

export default Header;
