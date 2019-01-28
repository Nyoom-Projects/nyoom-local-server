import deepstream = require('deepstream.io-client-js');


class DSCore {
    private deepstreamClient: deepstreamIO.Client;
    private username: string;


    constructor(loginCallback: (success: boolean, data: any) => void, errorCallback?: (error: any, args: any) => void) {
        const botCore = this;

        const ds = deepstream('10.5.54.81:7520');
        botCore.deepstreamClient = ds.login({
            username: 'pawel',
            password: 'Password@1',
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

    public addMessageHandler(callback: (data: any) => void) {
        this.deepstreamClient.event.subscribe(`ingress/bot/${this.username}`, callback);
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

    private createProjectPath(name: string) {
        return `project/${this.username}/${name}`;
    }
}

export = DSCore;
