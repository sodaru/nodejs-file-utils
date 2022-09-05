import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "fs";
import { copyFile, mkdir, readdir, stat } from "fs/promises";
import { tmpdir } from "os";
import { dirname, join, join as pathJoin, relative } from "path";
import { sync as rimrafSync } from "rimraf";

export const createTempDir = (prefix: string): string => {
  const tempDirPath = mkdtempSync(pathJoin(tmpdir(), prefix));
  const tempDirPathUnixStyle = tempDirPath.split("\\").join("/");
  return tempDirPathUnixStyle;
};

export const deleteDir = (dir: string): void => {
  rimrafSync(dir);
};

export const createFiles = (
  dir: string,
  paths: Record<string, string>
): void => {
  Object.keys(paths).forEach(path => {
    if (path.endsWith("/")) {
      const completePath = pathJoin(dir, path);
      mkdirSync(completePath, { recursive: true });
    } else {
      const data = paths[path];
      const completePath = pathJoin(dir, path);
      const pathDirectory = dirname(completePath);
      mkdirSync(pathDirectory, { recursive: true });
      writeFileSync(completePath, data);
    }
  });
};

export const readFiles = (dir: string): Record<string, string> => {
  if (!existsSync(dir)) {
    return {};
  }

  const files: Record<string, string> = {};
  const queue: string[] = ["."];
  let currentDir = queue.shift();

  while (currentDir) {
    const completePath = pathJoin(dir, currentDir);
    const dirFiles = readdirSync(completePath);
    if (dirFiles.length == 0) {
      dirFiles[currentDir + "/"] = "";
    }
    dirFiles.forEach(file => {
      const filePath = pathJoin(completePath, file);
      const stats = statSync(filePath);
      if (stats.isDirectory()) {
        queue.push(pathJoin(currentDir, file));
      } else if (stats.isFile()) {
        const data = readFileSync(filePath, { encoding: "utf8" });
        files[pathJoin(currentDir, file).split("\\").join("/")] = data;
      }
    });

    currentDir = queue.shift();
  }
  return files;
};

export const copyDirectory = async (
  source: string,
  target: string
): Promise<void> => {
  const dirsToCopy = [source];
  while (dirsToCopy.length > 0) {
    const dirToCopy = dirsToCopy.shift();
    const files = await readdir(dirToCopy);
    await Promise.all(
      files.map(async file => {
        const fileOrDirPath = join(dirToCopy, file);
        const stats = await stat(fileOrDirPath);
        if (stats.isDirectory()) {
          dirsToCopy.push(fileOrDirPath);
        } else {
          const targetPath = join(target, relative(source, fileOrDirPath));
          const targetDir = dirname(targetPath);
          await mkdir(targetDir, { recursive: true });
          await copyFile(fileOrDirPath, targetPath);
        }
      })
    );
  }
};

export const listFiles = async (
  dir: string,
  suffix?: string
): Promise<string[]> => {
  if (!dir || dir.trim().length == 0) {
    throw new Error("dir can not be empty");
  }
  const filePaths: string[] = [];
  const queue: string[] = ["."];
  let currentDir = queue.shift();
  while (currentDir) {
    const files = await readdir(pathJoin(dir, currentDir));
    await Promise.all(
      files.map(async file => {
        const stats = await stat(pathJoin(dir, currentDir, file));
        if (stats.isDirectory()) {
          queue.push(pathJoin(currentDir, file));
        } else if (!suffix || file.endsWith(suffix)) {
          filePaths.push(pathJoin(currentDir, file));
        }
      })
    );
    currentDir = queue.shift();
  }
  filePaths.sort();
  const normalizedFiles = filePaths.map(file => file.split("\\").join("/"));
  return normalizedFiles;
};
