#!/usr/bin/bash

echo serv

./bin/xml2json.js \
  --input ../../olofk/serv/top.xml \
  > demo/serv/hier.json

echo swerv

./bin/xml2json.js \
  --input ../../chipsalliance/Cores-SweRV/top.xml \
  > demo/swerv/hier.json

echo rocket-chip

./bin/xml2json.js \
  --input ../../chipsalliance/rocket-chip/vsim/top.xml \
  > demo/rocket-chip/hier.json
