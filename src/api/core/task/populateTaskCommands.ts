export default async (project: any, taskItem: any) => {
    if (taskItem.name.indexOf('^') === 0) {
        return {
            ...taskItem,
            commands: [{
                type: 'SHELL',
                command: taskItem.name.replace('^', ''),
                workDir: project.name,
            }],
        };
    }
    if (!project.tasks) {
        throw {
            message: `Project '${project.name}' does not have any tasks configured`,
        };
    }

    const taskName = taskItem.name.replace(':', '');
    const commands = project.tasks[taskName].map((command: any) => {
        command.workDir = command.workDir || project.name;

        return command;
    });

    if (commands) {
        return {
            ...taskItem,
            commands,
        };
    } else {
        throw {
            message: `Task '${taskName}' does not exist in '${project.name}'`,
        };
    }
};
