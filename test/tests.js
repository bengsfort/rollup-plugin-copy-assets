import assert from 'assert';
import { rollup } from 'rollup';
import fs from 'fs-extra';
import copy from '../dist/rollup-plugin-copy-assets.module';

// Change working directory to current
process.chdir(__dirname);

describe('rollup-plugin-copy-assets', function() {
  afterEach(() => fs.remove('output'));

  it('should copy the assets to output dir', function(done) {
    build({ assets: [ 'fixtures/top-level-item.txt' ] })
      .then(() => Promise.all([
        assertExists('output/top-level-item.txt'),
      ]))
      .then(() => done());
  });

  it('should copy folders to output dir with same hierarchy', function(done) {
    build({
      assets: [ 'fixtures/assets' ],
    }).then(() => Promise.all([
      assertExists('output/assets'),
      assertExists('output/assets/foo.txt'),
      assertExists('output/assets/bar.csv'),
    ]))
    .then(() => done());
  });

  it('should copy all paths given to it', function(done) {
    build({
      assets: [ 'fixtures/assets', 'fixtures/top-level-item.txt' ],
    }).then(() => Promise.all([
      assertExists('output/assets'),
      assertExists('output/assets/foo.txt'),
      assertExists('output/assets/bar.csv'),
    ]))
    .then(() => done());
  });

  it('should not fail when the directory exists', function(done) {
    const doBuild = () => build({
      assets: ['fixtures/assets/foo.txt'],
    }).then(() => Promise.all([
      assertExists('output/assets/foo.txt'),
    ]));
    doBuild().then(() => doBuild()).then(() => done());
  });
});

// Run the rollup build with an plugin configuration.
function build(config) {
  return rollup({
    input: './fixtures/index.js',
    plugins: [
      copy(config),
    ],
  }).then(bundle => bundle.write({
    file: 'output/bundle.js',
    format: 'iife',
    name: 'test',
  }));
}

// Asserts that a file does or does not exist.
function assertExists(file, shouldExist = true) {
  return fs.pathExists(file)
    .then((exists) => assert.ok(exists === shouldExist));
}
