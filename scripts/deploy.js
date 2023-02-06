import * as dotenv from 'dotenv';
import Client from 'ssh2-sftp-client';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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
try {
    console.log(`Deploy from: ${src} to: ${dest}`);

    await client.connect(config);
    client.on('upload', (info) => {
        console.log(`Uploaded ${info.source}`);
    });

    const dirExists = await client.exists(removeDir);
    if (dirExists) {
        await client.rmdir(removeDir, true);
    }

    await client.uploadDir(src, dest);

    console.log('Done');

    res = 0;
} catch (e) {
    console.log('Error: ', e.message);
} finally {
    client.end();
    process.exit(res);
}
