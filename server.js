const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const hapiJwtAuth = require('hapi-auth-jwt2');
const ejs = require('ejs');
const routes = require('./controller/routes');
const secret = require('./config');
require('./model/db');

const plugin = [Vision, hapiJwtAuth];
const validate = async (decoded, req, h) => {
    if (decoded.username == undefined) {
        return { isValid: false };
    }
    else {
        return { isValid: true };
    }
}

const init = async () => {
    const server = Hapi.server({
        port: "add your port",
        host: 'add your host',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    await server.register(plugin);
    server.auth.strategy('jwt', 'jwt',{
        key: secret,
        validate,
        verifyOptions: { algorithms: [ 'HS256' ] }, // only allow HS256 algorithm
    });
    server.auth.default('jwt');
    server.views({
        engines: {ejs: ejs},
        relativeTo: 'add your views path'
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();