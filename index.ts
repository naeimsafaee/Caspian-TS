import EthereumGenerator from "./app/Helper/Address/EthereumGenerator";

require("express-async-errors");

import express from 'express'

const app: express.Application = express();

require('dotenv').config()
require('@naeimsafaee/ns-config')

app.use((req, res, next) => {
    res.locals.app_url = process.env.APP_URL;
    next()
})

app.set('view engine', 'pug');
app.set('views', './views');

// require('./app/Helper/helper');

require('./app/Providers/DataBaseServiceProvider');
// require('./app/Providers/MailServiceProvider')(app);

// require('./app/Http/Middleware/Cors')(app);

process.on("uncaughtException", (ex) => {
    throw ex;
});
process.on("unhandledRejection", (ex) => {
    throw ex;
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));


app.use('/api', require('./routes/api'));
app.use('/', require('./routes/web'));

// app.use(require("./app/Http/Middleware/errorMiddleware"));

import CorsMiddleware from './app/Http/Middleware/CorsMiddleware'
CorsMiddleware.boot(app)

const server = app.listen(process.env.APP_PORT, function () {
    console.log(`Listening on port ${process.env.APP_PORT}...`);
    console.log(process.env.APP_URL);
});

import {WebSocket} from "./routes/socket"
new WebSocket(server)

import Kernel from './app/Console/kernel'
new Kernel()

/*WebSocket.get_instance(server).initializeHandlers([
    { path: '/orders', handler: new OrdersSocket() }
]);
*/



