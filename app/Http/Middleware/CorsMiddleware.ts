import Middleware from "./Middleware";
import express from "express";

class CorsMiddleware extends Middleware {

    constructor() {
        super();
        console.log('cors enabled.');
    }

    handle(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-expose-headers ,x-auth-token");
        next();
    }

}

export default CorsMiddleware


/*
module.exports = function (app) {

    console.log('cors enabled.');

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-expose-headers ,x-auth-token");
        next();
    });

    const cors = require("cors");

    app.use(cors({origin: '*', credentials: true, exposedHeaders: ['x-auth-token']}));

}*/
