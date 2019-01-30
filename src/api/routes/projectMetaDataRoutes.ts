import * as express from 'express';


export default (app: express.Application): void => {
    const controller = require('../controllers/projectMetaDataController');

    app.route('/project-metadata/:name')
        .post(controller.setProjectMetaData);
};
