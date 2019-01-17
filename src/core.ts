import deepstream = require('deepstream.io-client-js');


class DSCore {
    private deepstreamClient: deepstreamIO.Client;
    private username: string;


    constructor(loginCallback: (success: boolean, data: any) => void, errorCallback?: (error, args) => void) {
        const botCore = this;

        const ds = deepstream('192.168.2.37:7520');
        botCore.deepstreamClient = ds.login({
            username: 'pawel',
            password: 'Password@1',
        }, (success, data = {}) => {
            if (success) {
                this.username = (data && data.username) || 'pawel';

                botCore.deepstreamClient.record.getRecord('bots/' + this.username).whenReady((record) => {
                    const allowedUserIDs = (record.get('allowedUserIDs') || []);
                    console.log('allowedUserIDs', allowedUserIDs);

                    record.set('allowedUserIDs', allowedUserIDs);
                });
            }
            loginCallback(success, data);
        });

        if (errorCallback) {
            botCore.deepstreamClient.on('error', errorCallback);
        }
    }

    public createMiddleware() {
        const core = this;
        return (req, res, next) => {
            req.locals.core = core;

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
}

export = DSCore;
