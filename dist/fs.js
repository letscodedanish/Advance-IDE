"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchDirRecursive = exports.renameItem = exports.deleteItem = exports.createFolder = exports.createFile = exports.saveFile = exports.fetchFileContent = exports.fetchDir = void 0;
const fs_1 = __importDefault(require("fs"));
const chokidar_1 = __importDefault(require("chokidar"));
const fetchDir = (dir, baseDir) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(files.map(file => ({ type: file.isDirectory() ? "dir" : "file", name: file.name, path: `${baseDir}/${file.name}` })));
            }
        });
    });
};
exports.fetchDir = fetchDir;
const fetchFileContent = (file) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(file, "utf8", (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.fetchFileContent = fetchFileContent;
const saveFile = (file, content) => {
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(file, content, "utf8", (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.saveFile = saveFile;
const createFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(filePath, "", "utf8", (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.createFile = createFile;
const createFolder = (folderPath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.mkdir(folderPath, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.createFolder = createFolder;
const deleteItem = (itemPath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.rm(itemPath, { recursive: true, force: true }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.deleteItem = deleteItem;
const renameItem = (oldPath, newPath) => {
    return new Promise((resolve, reject) => {
        fs_1.default.rename(oldPath, newPath, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.renameItem = renameItem;
const watchDirRecursive = (dir, socket, cb) => {
    const watcher = chokidar_1.default.watch(dir, {
        persistent: true,
        ignoreInitial: true,
        alwaysStat: true,
        followSymlinks: true,
        ignored: [
            (path) => path.includes('node_modules'),
            (path) => { fs_1.default.existsSync(`${dir}/.next`); return path.includes('.next'); },
            (path) => { fs_1.default.existsSync(`${dir}/.git`); return path.includes('.git'); }
        ]
    });
    watcher.on('error', (error) => {
        console.error('Error watching directory:', error);
    });
    watcher.on('add', (newfile) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`New File ${newfile} added`, dir);
        yield cb(dir);
    }));
    watcher.on('unlink', (newfile) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`File deleted ${newfile}`, dir);
        yield cb(dir);
    }));
    watcher.on('addDir', (newDir) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`New directory ${newDir} added`);
        yield cb(dir);
        (0, exports.watchDirRecursive)(newDir, socket, (filePath) => __awaiter(void 0, void 0, void 0, function* () {
            // Handle nested directories if needed
            yield cb(filePath);
        }));
    }));
    watcher.on('unlinkDir', (newDir) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Directory deleted ${newDir}`);
        yield cb(dir);
        (0, exports.watchDirRecursive)(newDir, socket, (filePath) => __awaiter(void 0, void 0, void 0, function* () {
            // Handle nested directories if needed
            yield cb(filePath);
        }));
    }));
};
exports.watchDirRecursive = watchDirRecursive;
