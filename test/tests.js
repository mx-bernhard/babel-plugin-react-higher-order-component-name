const assert = require('assert');
const fs = require('fs');
const path = require('path');

const babel = require('@babel/core');

const fixturesDir = path.join(__dirname, 'fixtures');

const pluginPath = path.join(__dirname, '../src/');

function readFile(filename) {
  let file = fs.readFileSync(filename, 'utf8').trim();
  file = file.replace(/\r\n/g, '\n');
  return file;
}

const transformFile = filename => babel.transformFileSync(filename, {
  plugins: [
    pluginPath,
  ],
}).code;

describe('babel-plugin-react-higher-order-component-name', () => {
  fs.readdirSync(fixturesDir).forEach(fixture => {
    const actual = transformFile(path.join(fixturesDir, fixture, 'input.js'));
    // console.log(actual);
    const expected = readFile((path.join(fixturesDir, fixture, 'expected.js')));
    it(`transforms ${path.basename(fixture)}`, () => {
      expect(actual).toBe(expected);
    });
  });
});
