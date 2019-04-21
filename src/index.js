"use strict";

import fs from "fs-extra";
import path from "path";

/**
 * Takes an array of files/directories to copy to the final build directory.
 * @param {Object} options The options object.
 * @param {string[]} options.assets A list of paths to include, relative to the kk
 * @return {Object} The rollup code object.
 */
export default function copy(options = { assets: [] }) {
  const { assets } = options;
  let basedir = "";
  return {
    name: "copy-assets",
    options({ input }) {
      // Cache the base directory so we can figure out where to put assets.
      basedir = path.dirname(input);
      // eslint-disable-next-line
      console.log("Current basedir:", basedir);
    },
    generateBundle({ file, dir }) {
      const outputDirectory = dir || path.dirname(file);
      // eslint-disable-next-line
      console.log("Current outputDirectory:", outputDirectory);
      assets.map(async asset => {
        try {
          const target = path.join(outputDirectory, path.basename(asset));
          const normalizedAssetPath = path.normalize(basedir, asset);
          const assetPath = path.join(
            normalizedAssetPath,
            path.basename(asset)
          );
          //eslint-disable-next-line
          console.log("Current asset:", asset);
          //eslint-disable-next-line
          console.log("Current normalizedAssetPath:", normalizedAssetPath);
          //eslint-disable-next-line
          console.log("Current assetPath:", assetPath);
          // eslint-disable-next-line
          console.log("Current __dirname:", __dirname);
          // eslint-disable-next-line
          console.log("Current target:", target);
          const targetIsDir = path.extname(target) === "";
          const targetExists = await fs.pathExists(target);
          if (targetIsDir) {
            if (targetExists) await fs.emptyDir(target);
          } else {
            if (targetExists) {
              await fs.mkdirs(path.dirname(target));
              await fs.remove(target);
            }
          }
          await fs.copy(assetPath, target, {
            overwrite: true,
            errorOnExist: false,
          });
        } catch (e) {
          this.warn(`Could not copy ${asset} because of an error: ${e}`);
        }
      });
    },
  };
}
