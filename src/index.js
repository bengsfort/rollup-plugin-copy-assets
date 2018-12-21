'use strict';

import fs from 'fs-extra';
import path from 'path';

/**
 * Takes an array of files/directories to copy to the final build directory.
 * @param {Object} options The options object.
 * @return {Object} The rollup code object.
 */
export default function copy(options = {}) {
  const { assets } = options;
  let basedir = '';
  return {
    name: 'copy-assets',
    options: function options(options) {
      // Cache the base directory so we can figure out where to put assets.
      basedir = path.dirname(options.input);
    },
    generateBundle: ({ file, dir }) => {
      const outputDirectory = dir || path.dirname(file);
      return Promise.all(assets.map((asset) => fs.copy(
        asset,
        path.join(outputDirectory, path.relative(basedir, asset))
      )));
    },
  };
}
