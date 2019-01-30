import * as express from 'express';


export const setProjectMetaData = (req: any, res: express.Response): void => {
    const name = req.params.name;

    req.core.setProjectMetaData(name, req.body, (error: any) => {
        if (error) {
            res.status(error.code || 500);
            res.send({
                code: error.code || 'unknown',
                message: error.message,
            });
        } else {
            res.send({
                message: 'Project MetaData updated',
            });
        }
    });
};
