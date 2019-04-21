// import { expect } from "chai";
import { rollup } from "rollup";
import fs from "fs-extra";
import path from "path";
import copy from "../dist/rollup-plugin-copy-assets.module";

// Change working directory to current
// process.chdir(__dirname);

const OUTPUT_PATH = path.join(__dirname, "./output");
const EXISTING_PATH = path.join(__dirname, "./existing-dir");

beforeAll(async () => {
  await fs.remove(OUTPUT_PATH);
});

it("should copy the assets to the output dir", async () => {
  const input = {
    input: `${__dirname}/fixtures/index.js`,
    plugins: [copy({ assets: ["fixtures/top-level-item.txt"] })],
  };
  const output = {
    file: `${OUTPUT_PATH}/bundle.js`,
    format: "iife",
    name: "test",
  };
  const bundle = await rollup(input);
  const build = await bundle.write(output);

  const dirExists = await fs.pathExists(OUTPUT_PATH);
  expect(dirExists).toEqual(true);
  // eslint-disable-next-line
  console.log("Output path:", path.join(OUTPUT_PATH, "./top-level-item.txt"));
  const fileExists = await fs.pathExists(
    path.join(OUTPUT_PATH, "./top-level-item.txt")
  );
  expect(fileExists).toEqual(true);
});

// describe("rollup-plugin-copy-assets", function() {
// afterEach(() => fs.remove("output"));

// it("should copy the assets to output dir", function() {
//   return build({ assets: ["fixtures/top-level-item.txt"] })
//     .then(() => fs.pathExists(OUTPUT_PATH))
//     .then(dirExists => expect(dirExists).to.be.true)
//     .then(() => fs.pathExists(OUTPUT_PATH + "./top-level-item.txt"))
//     .then(fileExists => expect(fileExists).to.be.true);
// });

// it("should copy folders to output dir with same hierarchy", async function() {
//   await build({
//     assets: ["fixtures/assets"],
//   });
//   const dirExists = await fs.pathExists("./output/assets");
//   expect(dirExists).to.be.true;
//   const file1Exists = await fs.pathExists("./output/assets/foo.txt");
//   const file2Exists = await fs.pathExists("./output/assets/bar.csv");
//   expect(file1Exists).to.be.true;
//   expect(file2Exists).to.be.true;
// });

// it("should copy all paths given to it", async function() {
//   await build({
//     assets: ["fixtures/assets", "fixtures/top-level-item.txt"],
//   });
//   await assertExists("output/assets");
//   await assertExists("output/assets/foo.txt");
//   await assertExists("output/assets/bar.csv");
// });

// it("should not fail when the output path exists", async function() {
//   const inputOpts = {
//     input: "./fixtures/index.js",
//     plugins: [
//       copy({
//         assets: ["fixtures/assets/bar.csv"],
//       }),
//     ],
//   };
//   const outputOpts = {
//     file: "existing-dir/bundle.js",
//     format: "iife",
//     name: "test",
//   };
//   // Assert that the directory already exists
//   await assertExists("./existing-dir/assets");
//   await assertExists("./existing-dir/assets/bar.csv");
//   // Create bundle
//   const bundle = await rollup(inputOpts);
//   await bundle.write(outputOpts);
//   // Assert the files exist. If we have gotten this far, we have not errored out.
//   await assertExists("./existing-dir/bundle.js");
//   await assertExists("./existing-dir/assets");
//   await assertExists("./existing-dir/assets/bar.csv");
// });
// });

// Run the rollup build with an plugin configuration.
function build(config) {
  return rollup({
    input: "./__tests__/fixtures/index.js",
    plugins: [copy(config)],
  }).then(bundle =>
    bundle.write({
      file: "./__tests__/output/bundle.js",
      format: "iife",
      name: "test",
    })
  );
}

// Asserts that a file does or does not exist.
function assertExists(file, shouldExist = true) {
  return fs.pathExists(file).then(exists => assert.ok(exists === shouldExist));
}
