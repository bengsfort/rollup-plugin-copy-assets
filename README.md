# rollup-plugin-copy-assets

![build status](https://api.travis-ci.org/bengsfort/rollup-plugin-copy-assets.svg?branch=master) ![coverage](coverage/coverage.svg) [![npm version](https://badge.fury.io/js/rollup-plugin-copy-assets.svg)](https://www.npmjs.com/package/rollup-plugin-copy-assets)

Copy additional assets into the output directory of your rollup bundle.

## Installation

```shell
npm install --save-dev rollup-plugin-copy-assets
```

## Usage

```js
// rollup.config.js
import copy from "rollup-plugin-copy-assets";

export default {
  entry: "src/index.js",
  dest: "dist/bundle.js",
  plugins: [
    copy({
      assets: ["./src/assets", "./src/external/buffer.bin"],
    }),
  ],
};
```

On final bundle generation the provided files will be copied over into the output folder of your rollup bundle.

```bash
# Source directory structure
src/
- index.js
- assets/
  - some-library-needing-special-treatment.js
- external/
  - buffer.bin

# Output directory structure
dist/
- bundle.js
- assets/
  - some-library-needing-special-treatment.js
- external/
  - buffer.bin
```

### Options

- `assets`: **(required)** An array of paths to copy. Accepts files as well as directories.

## License

MIT
