import * as express from 'express';


export default (app: express.Application): void => {
    const controller = require('../controllers/projectController');

    app.route('/project(|s)')
        .get(controller.getProjects);

    app.route('/project(|s)/:name')
        .get(controller.getProject)
        .put(controller.createProject);

    app.route('/project(|s)/:name/:key')
        .get(controller.getProjectItem)
        .patch(controller.updateProjectItem);
};
