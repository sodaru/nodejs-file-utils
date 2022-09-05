import { readFile, writeFile } from "fs/promises";
import { readFileStore, updateFileStore, saveFileStore } from "./fileStore";

type IgnoreType = string[];

const readIgnoreFile = async (path: string): Promise<IgnoreType> => {
  const ignoreContent = await readFile(path, { encoding: "utf8" });
  const _ignore =
    ignoreContent.trim().length == 0 ? [] : ignoreContent.split("\n");
  return _ignore;
};

const writeIgnoreFile = async (
  path: string,
  ignore: IgnoreType
): Promise<void> => {
  const _ignore = [...ignore];
  if (_ignore[_ignore.length - 1] != "") {
    _ignore.push(""); // add a new line at the end of the file
  }
  const _json = _ignore.join("\n");
  await writeFile(path, _json);
};

export const readIgnoreFileStore = async (
  path: string,
  force = false
): Promise<IgnoreType> => {
  return await readFileStore(path, readIgnoreFile, force);
};

export const updateIgnoreFileStore = (path: string, json: IgnoreType): void => {
  return updateFileStore(path, json);
};

export const saveIgnoreFileStore = async (path: string): Promise<void> => {
  return await saveFileStore(path, writeIgnoreFile);
};
