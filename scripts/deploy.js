import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdir } from 'node:fs/promises';
import * as dotenv from 'dotenv';
import Client from 'ssh2-sftp-client';
import ProgressBar from 'progress';

/* eslint-disable no-console */

const filename = fileURLToPath(import.meta.url);
const currentDir = dirname(filename);

dotenv.config();

const config = {
    host: process.env.SFTP_SERVER,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD,
    port: process.env.SFTP_PORT,
};

const { APP_DIR } = process.env;
const DEPLOY_DIR = `${APP_DIR}-deploy`;
const BACKUP_DIR = `${APP_DIR}-backup`;

const client = new Client();
const src = join(currentDir, '..', 'dist');
const dest = process.env.DEPLOY_PATH;

const destPath = (...parts) => (
    `${dest}/${parts.join('/')}`
);

const removeByType = async (path, type) => {
    if (type === 'd') {
        await client.rmdir(path, true);
    } else if (type === '-') {
        await client.delete(path, true);
    }
};

const removeIfExists = async (path) => {
    const type = await client.exists(path);
    if (type !== false) {
        console.log(`Removing ${path}`);
    }

    return removeByType(path, type);
};

let res = 1;
let progress = null;
let backupPath = null;
const appPath = destPath(APP_DIR);
const deployPath = destPath(DEPLOY_DIR);

const restoreBackup = async () => {
    if (!backupPath) {
        return;
    }
    // Rename current app directory back to deploy
    await client.rename(appPath, deployPath);
    // Rename backup directory to back app
    await client.rename(backupPath, appPath);
};

const onError = async (e) => {
    console.log('Upload error: ', e.message);
    await restoreBackup();

    progress?.interrupt(`Upload error: ${e.message}`);
};

try {
    // Obtain total count of files
    const files = await readdir(src, { withFileTypes: true, recursive: true });
    const total = files.reduce((prev, file) => (prev + (file.isFile() ? 1 : 0)), 1);

    progress = new ProgressBar('[:bar] :percent :file', {
        total,
        width: 20,
        complete: '█',
        incomplete: ' ',
    });

    await client.connect(config);
    client.on('upload', (info) => {
        progress.tick({
            file: info.source.substring(src.length + 1),
        });
    });

    // Prepare empty deploy directory
    await removeIfExists(deployPath);
    await client.mkdir(deployPath, true);

    // Upload to deploy directory
    console.log(`Deploy from: ${src} to: ${deployPath}`);
    await client.uploadDir(src, deployPath);
    progress.tick({
        file: 'Done',
    });

    // Rename current app directory to backup if available
    const appDirType = await client.exists(appPath);
    if (appDirType === 'd') {
        backupPath = destPath(BACKUP_DIR);
        await removeIfExists(backupPath);
        await client.rename(appPath, backupPath);
    }

    // Rename deploy directory to app
    await client.rename(deployPath, appPath);

    // Remove backup directory
    await removeIfExists(backupPath);

    res = 0;
} catch (e) {
    onError(e);
} finally {
    client.end();
    process.exit(res);
}
