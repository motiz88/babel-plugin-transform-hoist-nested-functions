import path from 'path';
import fs from 'fs';
import { transformFileSync } from 'babel-core';
import { Suite } from 'benchmark';
import fixturesBabelConfig from '../test/fixtures-babel-config';

const benchmarksDir = path.join(__dirname, '../benchmarks');
fs.readdirSync(benchmarksDir).forEach((benchmarkName) => {
  if (benchmarkName.endsWith('.transformed.js')) return;
  const benchmarkFile = path.resolve(benchmarksDir, benchmarkName);

  const unmodified = setup(require(benchmarkFile));
  const hoistedCode = transformFileSync(benchmarkFile, fixturesBabelConfig()).code;
  const hoistedFile = path.join(benchmarksDir, path.basename(benchmarkName, '.js') + '.transformed.js');
  fs.writeFileSync(hoistedFile, hoistedCode);
  const hoisted = setup(require(hoistedFile));

  const suite = new Suite(benchmarkName);
  suite
    .add('unmodified', unmodified, { minSamples: 25 })
    .add('hoisted', hoisted, { minSamples: 25 })
    .on('start', function (event) {
      console.log(this.name); // eslint-disable-line no-console
    })
    .on('cycle', function (event) {
      console.log('-', String(event.target)); // eslint-disable-line no-console
    })
    .on('complete', function () {
      console.log(' ', this.filter('fastest').map('name') + ' is fastest'); // eslint-disable-line no-console
    })
    .run();
});

function setup (fn) {
  return fn;
}
