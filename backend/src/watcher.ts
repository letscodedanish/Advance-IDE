import chokidar from 'chokidar';
import { Socket } from "socket.io";
import { fetchDir, fetchFileContent, saveFile, createFile, createFolder, deleteItem, renameItem } from "./fs";
import path from 'path';

export function watchDirRecursive(dir: string, socket: Socket) {
    const watcher = chokidar.watch(dir, {
        persistent: true,
        ignoreInitial: true,
        alwaysStat: true,
        followSymlinks: true,
        ignored: [
            'node_modules',
            '.git',
            '.next'
        ]
    });

    const emitFileTreeUpdate = async () => {
        const updatedDir = await fetchDir(dir, '');
        socket.emit('fileTreeUpdate', updatedDir);
    };

    watcher.on('add', emitFileTreeUpdate);
    watcher.on('change', emitFileTreeUpdate);
    watcher.on('unlink', emitFileTreeUpdate);
    watcher.on('addDir', emitFileTreeUpdate);
    watcher.on('unlinkDir', emitFileTreeUpdate);

    watcher.on('error', (error) => {
        console.error('Error watching directory:', error);
    });
}
