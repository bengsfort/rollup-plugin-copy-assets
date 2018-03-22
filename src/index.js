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
  return {
    name: 'copy-assets',
    onwrite: function write(writeOptions) {
      console.log(arguments.length);
      const outputDirectory = path.dirname(writeOptions.file);
      return Promise.all(assets.map((asset) =>
        fs.copy(asset, path.join(outputDirectory, asset))
      ));
    },
  };
}
