import runAll from 'npm-run-all';

/* eslint-disable no-console */

const MAIN_PACKAGE = 'jezvejs';

const runCommand = async (command) => {
    const options = {
        stdin: process.stdin,
        stdout: process.stdout,
        stderr: process.stderr,
    };

    try {
        const [result] = await runAll([command], options);
        if (result.code !== 0) {
            console.log('Command failed');
            process.exit(result.code);
        }
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

if (process.argv.length < 3) {
    console.log('Usage: release.js <newversion> [<package>]');
    process.exit(1);
}

const newVersion = process.argv[2];
const packageName = (process.argv.length > 3)
    ? process.argv[3]
    : MAIN_PACKAGE;
const isMainPackage = (packageName === MAIN_PACKAGE);

const run = async () => {
    await runCommand('all');
    await runCommand(`p-version -- ${newVersion} -w ${packageName}`);
    await runCommand(`p-install -- -w ${packageName}`);
    await runCommand('p-update -- --save');

    if (isMainPackage) {
        await runCommand('build-all');
    }

    await runCommand(`p-publish -- -w ${packageName}`);

    if (isMainPackage) {
        await runCommand('commit-version');
        await runCommand('deploy');
    }
};

run();
