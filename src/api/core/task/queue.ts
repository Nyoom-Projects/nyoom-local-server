import convertTaskStringsToTaskItems from './convertTaskStringsToTaskItems';
import populateTaskCommands from './populateTaskCommands';


export const queue = async (core: any, projectParameters: string[], taskParameters: string[], projects: any) => {
    if (!projectParameters || !taskParameters) {
        throw {
            code: 400,
            message: 'projectParameters and taskParameters must both be present in body',
        };
    }
    if (!projects) {
        throw {
            code: 500,
            message: 'Server error, projects not supplied to task.queue.js/queue',
        };
    }

    projectParameters = projectParameters.filter((projectName: string) => projectName);
    const nonExistantProjects = projectParameters
        .filter((projectName: string) => projects.filter((project: any) => project.name === projectName).length === 0);

    const targetProjects = projects.filter((project: any) => projectParameters.filter(
        (projectName: string) => project.name === projectName).length !== 0,
    );

    console.log('nonExistantProjects', nonExistantProjects)
    console.log('targetProjects', targetProjects)
    if (nonExistantProjects.length !== 0) {
        throw {
            code: 400,
            message: `Projects [${nonExistantProjects.join(',')}] do not exist`,
        };
    } else {
        return await Promise.all(targetProjects.map(async (project: any) => {
            const taskItemsWithoutCommands = convertTaskStringsToTaskItems(taskParameters);

            const taskItems = await Promise.all(
                taskItemsWithoutCommands.map((taskItem: any) => populateTaskCommands(project, taskItem)),
            );
            const commandsList = taskItems.map((taskItem: any) => taskItem.commands.map((command: any) => ({
                ...command,
                task: taskItem,
            })));

            const commands = flatten(commandsList).map((command: any) => {
                command.project = project;
                command.project.tasks = undefined;

                return command;
            });
            console.log(commands);

            core.publishCommands('mac1', commands);
            return {
                project,
                commands,
            };
        }));
    }
};


const flatten = (list: any[]) => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [],
);
