import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import commandRoutes from './api/routes/commandRoutes';
import pingRoutes from './api/routes/pingRoutes';
import projectRoutes from './api/routes/projectRoutes';
import taskRoutes from './api/routes/taskRoutes';
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
    app.use(bodyParser.text());
    app.use(bodyParser.json());


    app.use(core.createMiddleware());

    commandRoutes(app);
    pingRoutes(app);
    projectRoutes(app);
    taskRoutes(app);

    return app;
};
