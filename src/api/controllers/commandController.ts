import * as express from 'express';


export const getCommand = (req: any, res: express.Response): void => {
    const {
        id,
    } = req.params;

    req.core.getCommandRecord(id).whenReady((command: any) => {
        res.send(command.get());
    });
};
