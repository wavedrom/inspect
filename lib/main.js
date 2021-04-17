'use strict';

const Fuse = require('fuse.js');
const React = require('react');
const ReactDOM = require('react-dom');

const reEl = require('./re-el.js');

const $ = React.createElement;

const El = reEl(React);

function App (props) {
  return $(El, Object.assign({depth: 0}, props));
}

const flatFromHier = tree => {
  const flat = [];
  const cellRec = cell => {
    flat.push(cell);
    (cell.scopes || []).map(cellRec);
  };
  cellRec(tree);
  return flat;
};

const inspectableReport = report => {
  const root = {
    type: 'module', name: 'top',
    scopes: []
  };

  report.map(row => {
    const pat = row.item.hier.split('.');
    pat.reduce((cur, ename) => {
      if (cur.scopes === undefined) {
        cur.scopes = [];
      }
      let scope = cur.scopes.find(scp => (scp.name === ename));
      if (scope === undefined) {
        scope = {type: 'module', name: ename, mname: row.item.submodname};
        cur.scopes.push(scope);
      }
      return scope;
    }, root);

  });

  return root;
};

global.Hier = async (divName, inpName, hierURL) => {

  const content = (typeof divName === 'string')
    ? document.getElementById(divName)
    : divName;

  const input = (typeof inpName === 'string')
    ? document.getElementById(inpName)
    : inpName;

  const resp = await fetch(hierURL);

  if (resp.status !== 200) {
    content.innerHTML = hierURL + ' not found';
    return;
  }

  const obj = await resp.json();
  const flat = flatFromHier(obj);

  const fuser = new Fuse(flat, {
    keys: ['name', 'submodname', 'hier'],
    useExtendedSearch: true
  });

  input.addEventListener('input', evnt => {
    const str = evnt.target.value;
    const report = fuser.search(str, {limit: 100});
    const insp = inspectableReport(report);
    ReactDOM.render(
      $(App, insp),
      content
    );
  });

  input.focus();
};

/* eslint-env browser */
