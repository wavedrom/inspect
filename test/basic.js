'use strict';

const React = require('react');
// const ReactDOMServer = require('react-dom/server');

const chai = require('chai');

const lib = require('../lib/index.js');

const expect = chai.expect;

describe('basic', function () {

  it('t0', function (done) {
    expect(lib).to.be.an('object');
    done();
  });

  it('t1', function (done) {
    expect(lib.reEl).to.be.an('function');
    done();
  });

  it('t2', function (done) {
    expect(lib.reEl(React)).to.be.an('function');
    done();
  });

});

/* eslint-env mocha */
