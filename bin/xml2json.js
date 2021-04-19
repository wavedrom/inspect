#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const fs = require('fs-extra');
const onml = require('onml');
const stringify = require('../lib/stringify.js');

const argv = yargs
  .option('input', {describe: 'path to the input XML file', alias: 'i'})
  .demandOption(['input'])
  .help()
  .argv;

const extract = ml => {
  const modules = [];
  let amodule;
  let vars, instances;
  const hstack = [{}];
  onml.traverse(ml, {
    enter: (n) => {

      if (n.name === 'cell') {
        const branch = {
          type: 'module',
          name: n.attr.name,
          submodname: n.attr.submodname,
          hier: n.attr.hier
        };
        hstack.push(branch);
      } else

      if (n.name === 'module') {
        vars = [];
        instances = [];
        amodule = {
          name: n.attr.name,
          origName: n.attr.origName,
          vars,
          instances
        };
        modules.push(amodule);
      } else

      if (n.name === 'var') {
        vars.push({
          type: n.attr.vartype,
          name: n.attr.name,
          dir: n.attr.dir
        });
      } else
      if (n.name === 'instance') {
        instances.push({
          name: n.attr.name,
          defName: n.attr.defName,
          origName: n.attr.origName
        });
      }
    },
    leave: (n) => {
      if (n.name === 'cell') {
        const top = hstack.pop();
        const head = hstack[hstack.length - 1];
        head.scopes = head.scopes || [];
        head.scopes.push(top);
      }
    }
  });
  return {
    hier: hstack[0].scopes[0],
    modules
  };
};

const main = async () => {
  const xml = await fs.readFile(argv.input, 'utf8');
  const ml = onml.parse(xml);
  const obj = extract(ml);
  // console.log(JSON.stringify(obj[0].scopes[0], null, 2)); /* eslint no-console: 0 */
  console.log(stringify(obj, {
    doubleQuoteObjectKeys: true,
    doubleQuoteStrings: true,
    propsPerLine: 4
  })); /* eslint no-console: 0 */
};

main();
