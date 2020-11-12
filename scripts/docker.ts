import * as shell from 'shelljs';

const tempDir = '.docker/';
shell.rm('-r', tempDir);
shell.mkdir(tempDir);
shell.cp('package.json', tempDir);
shell.cd(tempDir);
shell.exec('npm i --production');
shell.exec('npm run build');
shell.cd('..');
shell.exec('pwd');
shell.exec(`docker build -t tssdevs/auth-service .`);
shell.exec(`docker build -t auth-service-api .`);
shell.rm('-r', tempDir);
shell.exec('npm run build');