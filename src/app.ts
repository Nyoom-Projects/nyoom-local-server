import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import hitRoutes from './api/routes/hitRoutes';
import pingRoutes from './api/routes/pingRoutes';
import DSCore from './core';


export default (core: DSCore) => {
    const app = express();


    app.use(cors());
    app.use((_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());


    app.use(core.createMiddleware());

    hitRoutes(app);
    pingRoutes(app);

    return app;
};
