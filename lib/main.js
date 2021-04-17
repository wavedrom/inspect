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

  let t0;
  const content = (typeof divName === 'string')
    ? document.getElementById(divName)
    : divName;

  const input = (typeof inpName === 'string')
    ? document.getElementById(inpName)
    : inpName;

  t0 = Date.now();
  const resp = await fetch(hierURL);
  console.log('fetch: ' + (Date.now() - t0));

  if (resp.status !== 200) {
    content.innerHTML = hierURL + ' not found';
    return;
  }

  t0 = Date.now();
  const obj = await resp.json();
  console.log('json parse: ' + (Date.now() - t0));

  const flat = flatFromHier(obj);

  t0 = Date.now();
  const fuser = new Fuse(flat, {
    keys: ['name', 'submodname', 'hier'],
    useExtendedSearch: true
  });
  console.log('index: ' + (Date.now() - t0));

  const onUpdate = evnt => {
    const str = evnt.target.value;
    const report = fuser.search(str, {limit: 100});
    const insp = inspectableReport(report);
    ReactDOM.render(
      $(App, insp),
      content
    );
  };

  input.addEventListener('input', onUpdate);

  input.focus();
  onUpdate({target:{value: ''}});
};

/* eslint-env browser */
