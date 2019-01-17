import * as express from 'express';


export default (res: express.Response) => (err: any) => {
    console.error(err);
    res.status(err.code || 500);
    res.send(err);
};
