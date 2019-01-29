import * as express from 'express';


export default (app: express.Application): void => {
    const controller = require('../controllers/taskController');

    app.route('/tasks')
        .post(controller.addTasks);
};
