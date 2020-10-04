'use strict';

// const React = require('react');
// const ReactDOMServer = require('react-dom/server');
const chai = require('chai');

const lib = require('../lib/index.js');

const expect = chai.expect;
//
// const ast1 = {};

describe('basic', function () {

  it('t1', function (done) {
    expect(lib).to.be.an('object');
    done();
    // const res = ReactDOMServer.renderToStaticMarkup($(App, {data: ast1}));
  });

});

/* eslint-env mocha */
