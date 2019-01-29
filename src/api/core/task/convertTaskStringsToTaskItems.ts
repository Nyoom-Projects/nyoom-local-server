export default (tasks: any[]) => {
    return tasks.map((task: any) => {
        let name = task;
        let node = 'local';
        if (task.indexOf('@') !== -1) {
            name = task.split('@')[0];
            node = task.split('@')[1];
        }

        return {
            name,
            node,
        };
    });
};
