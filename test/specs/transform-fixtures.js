import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';
import fixturesBabelConfig from '../fixtures-babel-config';

function normalize (str) {
  return str.replace(/\r\n?/g, '\n').trim();
}

describe('hoist-nested-functions', () => {
  const fixturesDir = path.join(__dirname, '../fixtures');
  fs.readdirSync(fixturesDir).forEach((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFileSync(actualPath, fixturesBabelConfig).code;

      const expected = fs.readFileSync(
          path.join(fixtureDir, 'expected.js')
      ).toString();

      assert.equal(normalize(actual), normalize(expected));
    });
  });
});
