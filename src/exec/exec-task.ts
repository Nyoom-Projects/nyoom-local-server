import fs from 'fs';
import path from 'path';
import {exec, popd, pushd} from 'shelljs';


const ROOT_WORK_DIR = process.env.ROOT_WORK_DIR || '';

export default (command: string, workDir: string) => {
    return new Promise((resolve, reject) => {
        if (workDir) {
            const fullWorkPath = path.join(ROOT_WORK_DIR, workDir);
            if (fs.existsSync(fullWorkPath) && fs.statSync(fullWorkPath).isDirectory()) {
                pushd('-q', fullWorkPath);
            } else {
                reject({
                    stdout: '',
                    stderr: `Path '${fullWorkPath}' does not exist on filesystem`,
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
