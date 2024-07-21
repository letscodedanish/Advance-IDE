import fs from "fs";
import path from "path";
import chokidar from 'chokidar';
import { Socket } from "socket.io";

interface File {
    type: "file" | "dir";
    name: string;
    path: string;
}

export const fetchDir = (dir: string, baseDir: string): Promise<File[]>  => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files.map(file => ({ type: file.isDirectory() ? "dir" : "file", name: file.name, path: `${baseDir}/${file.name}`  })));
            }
        });       
    });
}

export const fetchFileContent = (file: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export const saveFile = (file: string, content: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, content, "utf8", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export const createFile = (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, "", "utf8", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export const createFolder = (folderPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.mkdir(folderPath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export const deleteItem = (itemPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.rm(itemPath, { recursive: true, force: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export const renameItem = (oldPath: string, newPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export const watchDirRecursive = (dir: string, socket: Socket, cb: (uri: string) => Promise<void>) => {
    const watcher = chokidar.watch(dir, {
        persistent: true,
        ignoreInitial: true,
        alwaysStat: true,
        followSymlinks: true,
        ignored: [
            (path) => path.includes('node_modules'),
            (path) => { fs.existsSync(`${dir}/.next`); return path.includes('.next') },
            (path) => { fs.existsSync(`${dir}/.git`); return path.includes('.git') }
        ]
    });

    watcher.on('error', (error) => {
        console.error('Error watching directory:', error);
    });

    watcher.on('add', async (newfile) => {
        console.log(`New File ${newfile} added`, dir);
        await cb(dir);
    });

    watcher.on('unlink', async (newfile) => {
        console.log(`File deleted ${newfile}`, dir);
        await cb(dir);
    });

    watcher.on('addDir', async (newDir) => {
        console.log(`New directory ${newDir} added`);
        await cb(dir);
        watchDirRecursive(newDir, socket, async (filePath) => {
            // Handle nested directories if needed
            await cb(filePath);
        });
    });

    watcher.on('unlinkDir', async (newDir) => {
        console.log(`Directory deleted ${newDir}`);
        await cb(dir);
        watchDirRecursive(newDir, socket, async (filePath) => {
            // Handle nested directories if needed
            await cb(filePath);
        });
    });
}
