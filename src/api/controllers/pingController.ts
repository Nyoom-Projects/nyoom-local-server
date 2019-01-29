import * as express from 'express';
import pkginfo = require('pkginfo');
pkginfo(module, 'version', 'author');


export const ping = (_req: express.Request, res: express.Response): void => {
    res.json({
        status: 'ok',
        version: module.exports.version,
    });
};
