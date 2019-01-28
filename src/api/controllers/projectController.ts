import * as express from 'express';


export const getProjects = (req: any, res: express.Response): void => {
    req.core.getProjectList().whenReady((list: any) => {
        res.send({
            projects: list.getEntries(),
        });
    });
};


export const createProject = (req: any, res: express.Response): void => {
    const name = req.params.name;

    req.core.addProject(name, (error: any) => {
        if (error) {
            res.status(error.code || 500);
            res.send({
                code: error.code || 'unknown',
                message: error.message,
            });
        } else {
            res.send({
                message: 'Project created',
            });
        }
    });
};


export const getProject = (req: any, res: express.Response): void => {
    const name = req.params.name;

    const project = req.core.getProject(name);
    project.whenReady((record: any) => {
        res.send(record.get());
    });
};
