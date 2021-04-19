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

const flatFromHier = obj => {
  const modulo = {};
  obj.modules.map(mod => {
    modulo[mod.name] = mod;
  });
  let flat = [];
  const cellRec = cell => {
    flat.push(cell);
    const vars = modulo[cell.submodname].vars;
    vars.map(val => {
      val.hier = cell.hier + '.' + val.name;
    });
    flat = flat.concat(vars);
    (cell.scopes || []).map(cellRec);
  };
  cellRec(obj.hier);
  return flat;
};

const inspectableReport = report => {
  const root = {
    type: 'hier', name: '---',
    scopes: []
  };

  report.map(row => {
    const pat = row.item.hier.split('.');
    pat.reduce((cur, ename, idx, arr) => {
      if (cur.scopes === undefined) {
        cur.scopes = [];
      }
      let scope = cur.scopes.find(scp => (scp.name === ename));
      if (scope === undefined) {
        scope = {
          type: (idx === (arr.length - 1)) ? row.item.type : 'module',
          dir: (idx === (arr.length - 1)) ? row.item.dir : undefined,
          name: ename,
          mname: row.item.submodname
        };
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
  console.log(flat);

  t0 = Date.now();
  const fuser = new Fuse(flat, {
    keys: ['name', 'submodname', 'hier'],
    useExtendedSearch: true
  });
  console.log('index: ' + (Date.now() - t0));

  let timeout;
  const onUpdate = evnt => {
    const str = evnt.target.value;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      t0 = Date.now();
      const report = fuser.search(str, {limit: 100});
      console.log('search: ' + (Date.now() - t0));
      // console.log(report);
      const insp = inspectableReport(report);
      // console.log(insp);
      ReactDOM.render(
        $(App, insp),
        content
      );
    }, 500);
  };

  input.addEventListener('input', onUpdate);

  input.focus();
  onUpdate({target:{value: ''}});
};

/* eslint-env browser */
