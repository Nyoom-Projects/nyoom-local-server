import fs from 'fs';
import path from 'path';
import {exec, popd, pushd} from 'shelljs';


export default (command: string, workDir: string) => {
    return new Promise((resolve, reject) => {
        if (workDir) {
            if (fs.existsSync(workDir) && fs.statSync(workDir).isDirectory()) {
                pushd('-q', workDir);
            } else {
                reject({
                    stdout: '',
                    stderr: `Path '${workDir}' does not exist on filesystem`,
                    exitCode: 1,
                });

                return;
            }
        }

        exec(command, (code: any, stdout: any, stderr: any) => {
            console.log('Exit code:', code);
            if (String(code) === '0') {
                resolve({
                    stdout,
                    stderr,
                    exitCode: code,
                });
            } else {
                reject({
                    stdout,
                    stderr,
                    exitCode: code,
                });
            }
        });
        if (workDir) {
            popd('-q');
        }
    });
};
