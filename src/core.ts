import deepstream = require('deepstream.io-client-js');
import {v4 as uuidV4} from 'uuid';
import CommandQueue from './queue';


interface ILoginData {
    username: string;
    password: string;
    nodeName: string;
}

class DSCore {
    private deepstreamClient: deepstreamIO.Client;
    private username: string;
    private nodeName: string;
    private commandQueue = new CommandQueue();


    constructor(loginData: ILoginData, loginCallback: (success: boolean, data: any) => void, errorCallback?: (error: any, args: any) => void) {
        const botCore = this;

        const ds = deepstream('10.5.43.58:7520');
        this.nodeName = loginData.nodeName;
        botCore.deepstreamClient = ds.login({
            username: loginData.username,
            password: loginData.password,
        }, (success, data = {}) => {
            if (success) {
                this.username = (data && data.username) || 'pawel';
            }
            loginCallback(success, data);
        });

        if (errorCallback) {
            botCore.deepstreamClient.on('error', errorCallback);
        }
    }

    public createMiddleware() {
        const core = this;
        return (req: any, _res: any, next: any) => {
            req.core = core;

            next();
        };
    }

    public onError(callback: (error: any, args: any) => void) {
        this.deepstreamClient.on('error', callback);
    }

    public listenForCommands() {
        const commandGroupIngest = this.deepstreamClient.record.getList(this.createCommandGroupPath(this.nodeName));
        commandGroupIngest.subscribe((commandItemIDs: any) => {
            console.log('commandItemIDs', commandItemIDs);


            for (const id of commandItemIDs) {
                commandGroupIngest.removeEntry(id);
                this.fetchAndQueueCommand(id);
            }
        }, true);
    }

    public publishCommands(targetNodeName: string, commandsToPublish: any[]) {
        const commandGroupIngestRecord = this.deepstreamClient.record.getList(this.createCommandGroupPath(targetNodeName));

        (async () => {
            const commands = commandsToPublish.map((command: any) => {
                command.id = this.generateID();

                return command;
            });

            commands.forEach((command: any, index: number, array: any[]) => {
                if (array.length > index + 1) {
                    command.nextCommandID = array[index + 1].id;
                }
            });

            return commands;
        })().then((commands: any) => {
            commandGroupIngestRecord.whenReady((commandGroupIngestList: deepstreamIO.List) => {
                Promise.all(commands.map((command: any) => this.createCommandTaskAndReturnID(command)))
                    .then((commandRecordIDs: any[]) => {
                        commandGroupIngestList.addEntry(commandRecordIDs[0]);
                    });
            });
        });
    }

    public reply(data: any, message: string) {
        this.deepstreamClient.event.emit(data.replyStream, {
            clientID: data.clientID,
            messageID: data.messageID,
            message,
        });
    }

    public getUserTargetList(clientID: string) {
        return this.deepstreamClient.record.getList(`targets/${this.username}/${clientID}`);
    }

    public sendMessageFromClient(target: string, clientID: string, messageContent: string, messageID: string) {
        this.deepstreamClient.event.emit(target, {
            clientID,
            message: messageContent,
            messageID,
            replyStream: 'ingress/tunnel/' + this.username,
        });
    }

    public getProjectList() {
        return this.deepstreamClient.record.getList('projects/' + this.username);
    }

    public addProject(name: string, callback?: (error?: any) => void) {
        const projectPath = this.createProjectPath(name);

        this.getProjectList().whenReady((list: any) => {
            if (list.getEntries().find((item: any) => item === projectPath) !== undefined) {
                callback({
                    code: 400,
                    message: `Project '${name}' already exists`,
                });
            } else {
                const project = this.deepstreamClient.record.getRecord(projectPath);

                project.set({
                    name,
                }, (error: string) => {
                    if (error) {
                        callback({
                            message: error,
                        });
                    } else {
                        list.addEntry(projectPath);
                        callback();
                    }
                });
            }
        });
    }

    public getProject(name: string) {
        return this.deepstreamClient.record.getRecord(this.createProjectPath(name));
    }

    public getProjectMetaData(name: string) {
        return this.deepstreamClient.record.getRecord(this.createProjectMetaDataPath(name));
    }

    public getProjects(paths: string[], callback: (projects: any[]) => void) {
        Promise.all(paths.map((path: string) => {
            return new Promise((resolve) => {
                this.deepstreamClient.record.getRecord(path)
                .whenReady((record: deepstreamIO.Record) => {
                    resolve({
                        ...record.get(),
                        name: path.substring(path.lastIndexOf('/') + 1),
                    });
                });
            });
        })).then(callback);
    }

    public getCommandRecord(id: string) {
        return this.deepstreamClient.record.getRecord(this.createCommandPath(id));
    }

    private createCommandTaskAndReturnID(command: any) {
        command.id = command.id || this.generateID();
        const id = command.id;
        const commandRecord = this.getCommandRecord(id);

        return new Promise((resolve) => {
            commandRecord.whenReady((record: any) => {
                record.set(command);

                resolve(id);
            });
        });
    }

    private fetchAndQueueCommand(id: string) {
        this.getCommandRecord(id).whenReady((record: deepstreamIO.Record) => {
            const command = record.get();

            this.commandQueue.queueCommand(command, (success: boolean, result: any) => {
                record.set('result', result);
                if (success && command.nextCommandID) {
                    this.fetchAndQueueCommand(command.nextCommandID);
                }
            });
        });
    }

    private generateID() {
        return uuidV4();
    }

    private createProjectPath(name: string) {
        return `project/${this.username}/${name}`;
    }

    private createProjectMetaDataPath(name: string) {
        return `project-metadata/${this.username}/${this.nodeName}/${name}`;
    }

    private createCommandGroupPath(nodeName: string) {
        return `commandGroupIngest/${this.username}/${nodeName}`;
    }

    private createCommandPath(id: string) {
        return `command/${this.username}/${id}`;
    }
}

export = DSCore;
