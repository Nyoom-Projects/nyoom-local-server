import * as express from 'express';
import {queue} from '../core/task/queue';


export const addTasks = (req: any, res: express.Response): void => {
    const {
        taskParameters,
        projectParameters,
    } = req.body;

    req.core.getProjectList().whenReady((list: any) => {
        req.core.getProjects(list.getEntries(), (projects: any[]) => {
            queue(req.core, projectParameters, taskParameters, projects)
            .then((result: any) => {
                res.send(result);
            })
            .catch((err: any) => {
                console.error(err);

                res.status(err.code || 500);
                res.send(err);
            });
        });
    });
};
