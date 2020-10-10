#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const fs = require('fs-extra');
const onml = require('onml');

const argv = yargs
  .option('input', {describe: 'path to the input XML file', alias: 'i'})
  .demandOption(['input'])
  .help()
  .argv;

const extract = ml => {
  const stack = [{}];
  onml.traverse(ml, {
    enter: (n) => {
      if (n.name === 'cell') {
        const branch = {
          type: 'module',
          name: n.attr.name,
          mname: n.attr.submodname
        };
        stack.push(branch);
      }
    },
    leave: (n) => {
      if (n.name === 'cell') {
        const top = stack.pop();
        const head = stack[stack.length - 1];
        head.scopes = head.scopes || [];
        head.scopes.push(top);
      }
    }
  });
  return stack;
};

const main = async () => {
  const xml = await fs.readFile(argv.input, 'utf8');
  const ml = onml.parse(xml);
  const obj = extract(ml);
  console.log(JSON.stringify(obj[0].scopes[0], null, 2));
};

main();
