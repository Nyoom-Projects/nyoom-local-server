import * as express from 'express';


export default (app: express.Application): void => {
    const controller = require('../controllers/commandController');

    app.route('/command(|s)/:id')
        .get(controller.getCommand);
};
