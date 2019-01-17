import * as express from 'express';


export default (app: express.Application): void => {
    const pingController = require('../controllers/pingController');

    app.route('/ping')
        .get(pingController.ping);
};
