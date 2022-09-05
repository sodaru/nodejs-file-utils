import { readFile, writeFile } from "fs/promises";
import { readFileStore, updateFileStore, saveFileStore } from "./fileStore";

type JSONType = Record<string, unknown>;

const readJson = async (path: string): Promise<JSONType> => {
  const jsonContent = await readFile(path, { encoding: "utf8" });
  const _json = JSON.parse(jsonContent);
  return _json;
};

const writeJson = async (path: string, json: JSONType): Promise<void> => {
  const _json = JSON.stringify(json, null, 2) + "\n"; // prettier expects new line at the end of json file
  await writeFile(path, _json);
};

export const readJsonFileStore = async (
  path: string,
  force = false
): Promise<JSONType> => {
  return await readFileStore(path, readJson, force);
};

export const updateJsonFileStore = (path: string, json: JSONType): void => {
  return updateFileStore(path, json);
};

export const saveJsonFileStore = async (path: string): Promise<void> => {
  return await saveFileStore(path, writeJson);
};
