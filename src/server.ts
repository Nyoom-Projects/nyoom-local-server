import createApp from './app';
import DSCore from './core';


const loginData = {
    username: 'pawel',
    password: 'Password@1',
    nodeName: 'mac1',
};

const core = new DSCore(loginData, (loginSuccess: boolean, clientData: any) => {
    if (!loginSuccess) {
        console.error('Login failed');
        process.exit(-1);
    } else {
        console.log('Successfully logged in.', clientData);

        core.listenForCommands();
        startAPIServer((clientData || {}).username);
    }
}, (error: any, args: any) => {
    console.error(error, args);
});


const startAPIServer = (username: string) => {
    const port = process.env.PORT || 7300;

    const app = createApp(core);
    app.listen(port);
    console.info('API server started on: ' + port);
};
