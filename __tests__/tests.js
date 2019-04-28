import { rollup } from "rollup";
import fs from "fs-extra";
import path from "path";
import os from "os";
import copy from "../src";

let TEST_DIR;

beforeEach(async () => {
  TEST_DIR = path.join(os.tmpdir(), "rollup-plugin-copy-assets");
  await fs.emptyDir(TEST_DIR);
});

afterAll(async () => {
  await fs.emptyDir(TEST_DIR);
});

it("should copy the assets to the output dir", async () => {
  const BUNDLE_PATH = path.join(TEST_DIR, "bundle.js");
  const ASSET_PATH = path.join(TEST_DIR, "top-level-item.txt");

  const input = {
    input: `${__dirname}/fixtures/index.js`,
    plugins: [copy({ assets: ["fixtures/top-level-item.txt"] })],
  };
  const output = {
    file: BUNDLE_PATH,
    format: "iife",
    name: "test",
  };
  const bundle = await rollup(input);
  await bundle.write(output);

  await expect(fs.pathExists(BUNDLE_PATH)).resolves.toEqual(true);
  await expect(fs.pathExists(ASSET_PATH)).resolves.toEqual(true);
});

it("should not fail when used with an array of inputs", async () => {
  const BUNDLE1_PATH = path.join(TEST_DIR, "index.js");
  const BUNDLE2_PATH = path.join(TEST_DIR, "index2.js");
  const ASSET_PATH = path.join(TEST_DIR, "top-level-item.txt");

  const input = {
    input: [
      path.join(__dirname, "fixtures", "index.js"),
      path.join(__dirname, "fixtures", "index2.js"),
    ],
    plugins: [copy({ assets: ["fixtures/top-level-item.txt"] })],
  };
  const output = {
    dir: TEST_DIR,
    format: "cjs",
  };
  const bundle = await rollup(input);
  await bundle.write(output);

  await expect(fs.pathExists(BUNDLE1_PATH)).resolves.toEqual(true);
  await expect(fs.pathExists(BUNDLE2_PATH)).resolves.toEqual(true);
  await expect(fs.pathExists(ASSET_PATH)).resolves.toEqual(true);
});

it("should copy directories of assets", async () => {
  const BUNDLE_PATH = path.join(TEST_DIR, "bundle.js");
  const TOP_LEVEL_ASSET = path.join(TEST_DIR, "top-level-item.txt");
  const ASSET_FOLDER = path.join(TEST_DIR, "assets");
  const CSV_ASSET = path.join(ASSET_FOLDER, "bar.csv");
  const TXT_ASSET = path.join(ASSET_FOLDER, "foo.txt");

  await expect(fs.pathExists(BUNDLE_PATH)).resolves.toEqual(false);
  await expect(fs.pathExists(TOP_LEVEL_ASSET)).resolves.toEqual(false);
  await expect(fs.pathExists(CSV_ASSET)).resolves.toEqual(false);
  await expect(fs.pathExists(TXT_ASSET)).resolves.toEqual(false);

  const input = {
    input: path.join(__dirname, "fixtures", "index.js"),
    plugins: [
      copy({ assets: ["fixtures/assets", "fixtures/top-level-item.txt"] }),
    ],
  };
  const output = {
    file: BUNDLE_PATH,
    format: "iife",
    name: "test",
  };

  const bundle = await rollup(input);
  await bundle.write(output);

  await expect(fs.pathExists(BUNDLE_PATH)).resolves.toEqual(true);
  await expect(fs.pathExists(TOP_LEVEL_ASSET)).resolves.toEqual(true);
  await expect(fs.pathExists(CSV_ASSET)).resolves.toEqual(true);
  await expect(fs.pathExists(TXT_ASSET)).resolves.toEqual(true);
});

it("should not fail when an asset or directory already exists", async () => {
  const BUNDLE_PATH = path.join(TEST_DIR, "bundle.js");
  const ASSET_FOLDER = path.join(TEST_DIR, "assets");
  const TOP_LEVEL_ASSET = path.join(TEST_DIR, "top-level-item.txt");
  const CSV_ASSET = path.join(ASSET_FOLDER, "bar.csv");
  const TXT_ASSET = path.join(ASSET_FOLDER, "foo.txt");

  // Create all of the files so they exist
  await fs.ensureFile(BUNDLE_PATH);
  await fs.ensureFile(TOP_LEVEL_ASSET);
  await fs.ensureFile(CSV_ASSET);
  await fs.ensureFile(TXT_ASSET);

  await expect(fs.pathExists(BUNDLE_PATH)).resolves.toEqual(true);
  await expect(fs.pathExists(TOP_LEVEL_ASSET)).resolves.toEqual(true);
  await expect(fs.pathExists(CSV_ASSET)).resolves.toEqual(true);
  await expect(fs.pathExists(TXT_ASSET)).resolves.toEqual(true);

  const input = {
    input: path.join(__dirname, "fixtures", "index.js"),
    plugins: [
      copy({ assets: ["fixtures/assets", "fixtures/top-level-item.txt"] }),
    ],
  };
  const output = {
    file: BUNDLE_PATH,
    format: "iife",
    name: "test",
  };

  const bundle = await rollup(input);
  await bundle.write(output);

  await expect(fs.pathExists(BUNDLE_PATH)).resolves.toEqual(true);
  await expect(fs.pathExists(TOP_LEVEL_ASSET)).resolves.toEqual(true);
  await expect(fs.pathExists(CSV_ASSET)).resolves.toEqual(true);
  await expect(fs.pathExists(TXT_ASSET)).resolves.toEqual(true);
});
