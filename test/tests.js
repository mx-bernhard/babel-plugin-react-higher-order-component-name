const assert = require('assert');
const fs = require('fs');
const path = require('path');

const babel = require('@babel/core');

const fixturesDir = path.join(__dirname, 'fixtures');

const pluginPath = path.join(__dirname, '../../babel-plugin-react-component-name-for-hoc');

function readFile(filename) {
  let file = fs.readFileSync(filename, 'utf8').trim();
  file = file.replace(/\r\n/g, '\n');
  return file;
}
const babelConfig = require('../../webpack.babel.config');

const transformFile = filename => babel.transformFileSync(filename, {
  plugins: [
    pluginPath,
  ],
}).code;

describe('babel-plugin-react-component-name-for-hoc', () => {
  fs.readdirSync(fixturesDir).forEach(fixture => {
    const actual = transformFile(path.join(fixturesDir, fixture, 'input.js'));
    console.log(actual);
    const expected = readFile((path.join(fixturesDir, fixture, 'expected.js')));
    it(`transforms ${path.basename(fixture)}`, () => {
      assert.equal(actual, expected);
    });
  });
});

describe('our config', () => {
  const transformFileWithOurBabelConfig = filename => babel.transformFileSync(filename, {
    envName: 'development',
    presets: [
      () => require('../../webpack.babel.config'),
    ],
    // presets: [
    //   require('@mobilex/babel-preset-mip'),
    //   [require('@babel/preset-react'), { runtime: 'automatic' }],
    // ],
    // plugins: [
    //   pluginPath,
    // ],
  }).code;
  // const file = readFile()
  // const actual = transformFileWithOurBabelConfig(path.join(__dirname, '../../core/src/login/authentication.ts'));
  const actual = transformFileWithOurBabelConfig(path.join(__dirname, '../../core/src/index.tsx'));

  console.log(actual);
});
