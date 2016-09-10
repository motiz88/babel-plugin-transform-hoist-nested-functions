import path from 'path';
import fs from 'fs';
import { transformFileSync } from 'babel-core';
import fixturesBabelConfig from '../test/fixtures-babel-config';

const fixturesDir = path.join(__dirname, '../test/fixtures');
fs.readdirSync(fixturesDir).forEach((caseName) => {
  process.stdout.write(caseName + '\n');
  const fixtureDir = path.join(fixturesDir, caseName);
  const actualPath = path.join(fixtureDir, 'actual.js');
  const actual = transformFileSync(actualPath, fixturesBabelConfig).code;

  fs.writeFileSync(
    path.join(fixtureDir, 'expected.js'),
    actual
  );
});
