import Queue from 'better-queue';
import exec from './exec/exec-task';


export default class CommandQueue {
    private queue: Queue;


    constructor() {
        this.queue = new Queue((command, cb) => {
            (async () => {
                switch (command.type) {
                    case 'SHELL':
                        console.info(`\n\nExecuting \`${command.command}\` in '${command.workDir}':`);
                        return await exec(command.command, command.workDir);

                    default:
                        throw {
                            message: `Unsupported command type '${command.type}'`,
                        };
                }
            })().then((result) => {
                cb(null, result);
            })
            .catch((err: any) => {
                cb(err);
            });
        });
    }

    public queueCommand(command: any, callback: (success: boolean, err?: any) => void) {
        this.queue.push(command)
        .on('finish', (result) => {
            callback(true, result);
        })
        .on('failed', (err) => {
            console.error('Command Error:', err.message || err);
            callback(false, err);
        });
    }
}
