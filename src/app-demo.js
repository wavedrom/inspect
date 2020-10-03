'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const $ = React.createElement;
// const {useState} = React;

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
  }]
};

function Var (props) {
  return $('div', {}, props.type, props.size, props.name);
}

function El (props) {
  return $('div',
    {
      'data-depth': props.depth,
      style: {
        position: 'absolute',
        left: 0,
        // top: 18 * props.depth,
        height: 18,
        width: '100%'
      }
    },
    $('div',
      {
        style: {
          transform: 'translateX(calc(2 * var(--indentation-size)))'
        }
      },
      props.name,
      (props.vars || []).map(e =>
        $(Var, e)
      ),
      (props.scopes || []).map(e =>
        $(El, Object.assign({depth: props.depth + 1}, e))
      )
    )
  );
}

function App (props) {
  return $('div', {}, $(El, Object.assign({depth: 0}, props)));
}

ReactDOM.render(
  $(App, zooData),
  document.getElementById('root')
);

/* eslint-env browser */
