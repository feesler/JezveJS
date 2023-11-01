import shell from 'shelljs';

const MAIN_PACKAGE = 'jezvejs';

const runCommand = (command) => {
    const result = shell.exec(command);
    if (result.code !== 0) {
        shell.exit(result.code);
    }
};

if (process.argv.length < 3) {
    shell.echo('Usage: release.js <newversion> [<package>]');
    shell.exit(1);
}

const newVersion = process.argv[2];
const packageName = (process.argv.length > 3)
    ? process.argv[3]
    : MAIN_PACKAGE;
const isMainPackage = (packageName === MAIN_PACKAGE);

runCommand('npm run all');
runCommand(`npm version ${newVersion} -w ${packageName}`);
runCommand(`npm install -w ${packageName}`);
runCommand('npm update --save');

if (isMainPackage) {
    runCommand('npm run build-all');
}

runCommand(`npm publish -w ${packageName}`);

if (isMainPackage) {
    runCommand('npm run commit-version');
    runCommand('npm run deploy');
}
