'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const reEl = require('../lib/re-el.js');
// const zooData = require('./test.json');
const zooData = require('./zoo.json');

const $ = React.createElement;
const El = reEl(React);

function App (props) {
  return $('div', {}, $(El, Object.assign({depth: 0}, props)));
}

ReactDOM.render(
  $(App, zooData),
  document.getElementById('root')
);

/* eslint-env browser */
