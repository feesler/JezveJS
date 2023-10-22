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

const client = new Client();
const src = join(currentDir, '..', 'dist');
const dest = process.env.DEPLOY_PATH;
const removeDir = `${dest}/demo`;

let res = 1;
let progress = null;

try {
    console.log(`Deploy from: ${src} to: ${dest}`);

    // Obtain total count of files
    const files = await readdir(src, { withFileTypes: true, recursive: true });
    const total = files.reduce((prev, file) => (prev + (file.isFile() ? 1 : 0)), 1);

    progress = new ProgressBar(':bar :percent :file', {
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

    // Remove destination directory before upload
    const dirExists = await client.exists(removeDir);
    if (dirExists) {
        await client.rmdir(removeDir, true);
    }

    await client.uploadDir(src, dest);
    progress.tick({
        file: 'Done',
    });

    res = 0;
} catch (e) {
    progress?.interrupt(`Upload error: ${e.message}`);
} finally {
    client.end();
    process.exit(res);
}
