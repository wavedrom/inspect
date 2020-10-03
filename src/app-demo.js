'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const reEl = require('../lib/re-el.js');

const zooData = {
  type: 'module', name: 'foo',
  vars: [
    {type: 'wire', size: 1,  name: 'clk', id: 'X'},
    {type: 'reg',  size: 32, name: 'dat', id: 'Y'}
  ],
  scopes: [{
    type: 'module', name: 'bar',
    scopes: [{
      type: 'module', name: 'baz',
      vars: [
        {type: 'wire', size: 1,  name: 'clk', id: 'X'},
        {type: 'reg',  size: 32, name: 'dat', id: 'Y'}
      ]
    }]
  }, {
    type: 'task', name: 'main_task'
  }]
};

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
