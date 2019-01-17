import * as express from 'express';


export const ping = (_req: express.Request, res: express.Response): void => {
    res.json({
        status: 'ok',
    });
};
