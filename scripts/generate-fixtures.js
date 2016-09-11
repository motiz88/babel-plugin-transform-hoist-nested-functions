import path from 'path';
import fs from 'fs';
import { transformFileSync } from 'babel-core';
import fixturesBabelConfig from '../test/fixtures-babel-config';

const only = process.argv.slice(2);

const fixturesDir = path.join(__dirname, '../test/fixtures');
fs.readdirSync(fixturesDir).forEach((caseName) => {
  if (only.length && only.indexOf(caseName) === -1) return;
  process.stdout.write(caseName + '\n');
  const fixtureDir = path.join(fixturesDir, caseName);
  const optionsPath = path.join(fixtureDir, 'options.json');
  const options = fixturesBabelConfig(fs.existsSync(optionsPath) ? JSON.parse(fs.readFileSync(optionsPath).toString()) : {});
  const actualPath = path.join(fixtureDir, 'actual.js');
  const actual = transformFileSync(actualPath, options).code;

  fs.writeFileSync(
    path.join(fixtureDir, 'expected.js'),
    actual
  );
});
