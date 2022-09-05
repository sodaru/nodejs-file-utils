# Nodejs File Utils

File utility functions for filesystem in Nodejs

## Install

```
npm i nodejs-file-utils
```

## Available Utils

### File Store

Read and write common file types with cached storage

```typescript
import { readFile, writeFile } from "fs/promises";
import {
  readFileStore,
  updateFileStore,
  saveFileStore
} from "nodejs-file-utils";

type JSONType = Record<string, unknown>;

const readJson = async (path: string): Promise<JSONType> => {
  // read json file and return the json value
};

const writeJson = async (path: string, json: JSONType): Promise<void> => {
  // write to json file
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
```

`readFileStore`, `updateFileStore`, and `saveFileStore` provides the caching for file content

By default these 3 file types are implemented

- JSON

  ```typescript
  import {
    readJsonFileStore,
    updateJsonFileStore,
    saveJsonFileStore
  } from "nodejs-file-utils";
  ```

- YAML

  ```typescript
  import {
    readYamlFileStore,
    updateYamlFileStore,
    saveYamlFileStore
  } from "nodejs-file-utils";
  ```

- Ignore files

  ```typescript
  import {
    readIgnoreFileStore,
    updateIgnoreFileStore,
    saveIgnoreFileStore
  } from "nodejs-file-utils";
  ```

### Directory Utilities

- `createTempDir`

  ```typescript
  import { createTempDir } from "nodejs-file-utils";

  const tempDir = createTempDir(prefix);
  ```

- `deleteDir`

  ```typescript
  import { deleteDir } from "nodejs-file-utils";

  deleteDir(prefix);
  ```

- `createFiles`

  ```typescript
  import { createFiles } from "nodejs-file-utils";

  createFiles(
    dir, // root directory
    filesContent // Map of file content to file path inside dir
  );
  ```

- `readFiles`

  ```typescript
  import { readFiles } from "nodejs-file-utils";

  const filesContent = readFiles(dir);
  // read all files content with in a dir
  ```

- `copyDirectory`

  ```typescript
  import { copyDirectory } from "nodejs-file-utils";

  await copyDirectory(sourcePath, destinationPath);
  // sourcePath must exist
  ```

- `listFiles`

  ```typescript
  import { listFiles } from "nodejs-file-utils";

  const files = await listFiles(dir, extention);
  // recursively lists all files under dir
  // extention is optional to filter files of perticular extention
  ```

- `unixStylePath`

  ```typescript
  import { unixStylePath } from "nodejs-file-utils";

  const unixPath = await unixStylePath(path);
  // replaces all '\\' with '/'
  ```

## Support

This project is a part of Open Source Intitiative from [Sodaru Technologies](https://sodaru.com)

Write an email to opensource@sodaru.com for queries on this project
