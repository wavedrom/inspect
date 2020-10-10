[![NPM version](https://img.shields.io/npm/v/@wavedrom/inspect.svg)](https://www.npmjs.org/package/@wavedrom/inspect)
[![Actions Status](https://github.com/wavedrom/inspect/workflows/Tests/badge.svg)](https://github.com/wavedrom/inspect/actions)

HDL design hierarchy inspector. React component.

Inspired by [React Dev Tools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)

## Usage

```
npm i @wavedrom/inspect
```

### with React

```js
const React = require('react');
const inspect = require('@wavedrom/inspect');

const $ = React.createElement;

const El = inspect.reEl(React);

...
$(El, {})
...
```

## Demo

```
npm i
npm run build-demo
http-server demo &
```

## Develop

```
npm i
npm test
```
