import shell from 'shelljs';

const MAIN_PACKAGE = 'jezvejs';

if (process.argv.length < 3) {
    shell.echo('Usage: release.js <newversion> [<package>]');
    shell.exit(1);
}

const newVersion = process.argv[2];
const packageName = (process.argv.length > 3)
    ? process.argv[3]
    : MAIN_PACKAGE;
const isMainPackage = (packageName === MAIN_PACKAGE);

shell.exec('npm run all');
shell.exec(`npm version ${newVersion} -w ${packageName}`);
shell.exec(`npm install -w ${packageName}`);
shell.exec('npm update --save');

if (isMainPackage) {
    shell.exec('npm run build-all');
}

shell.exec(`npm publish -w ${packageName}`);

if (isMainPackage) {
    shell.exec('npm run commit-version');
    shell.exec('npm run deploy');
}
