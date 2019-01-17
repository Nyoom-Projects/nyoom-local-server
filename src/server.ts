import createApp from './app';
import DSCore from './core';


const core = new DSCore((loginSuccess, clientData) => {
    if (!loginSuccess) {
        console.error('Login failed');
        process.exit(-1);
    } else {
        console.log('Successfully logged in.', clientData);

        startAPIServer((clientData || {}).username);
    }
}, (error, args) => {
    console.error(error, args);
});


const startAPIServer = (username) => {
    const port = process.env.PORT || 7300;

    const app = createApp(core);
    app.listen(port);
    console.info('API server started on: ' + port);
};
