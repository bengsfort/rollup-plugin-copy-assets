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
      if (Array.isArray(input)) {
        basedir = path.dirname(input[0]);
      } else if (typeof input === "object") {
        basedir = path.dirname(input[Object.keys(input)[0]]);
      } else {
        basedir = path.dirname(input);
      }
    },
    async generateBundle({ file, dir }) {
      const outputDirectory = dir || path.dirname(file);
      return Promise.all(
        assets.map(async asset => {
          try {
            const assetChildPath = asset
              .replace(
                path.basename(basedir), 
                ""
              );
            const target = path.join(outputDirectory, assetChildPath);
            const normalizedAssetPath = path.normalize(basedir);
            const assetPath = path.join(
              normalizedAssetPath,
              assetChildPath
            );
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
            return await fs.copy(assetPath, target, {
              overwrite: true,
              errorOnExist: false,
            });
          } catch (e) {
            this.warn(`Could not copy ${asset} because of an error: ${e}`);
          }
        })
      );
    },
  };
}
