
import {NextFunction, Request, Response} from 'express'
import express from "express";


abstract class Middleware {

    abstract handle(req:Request, res:Response, next:NextFunction): void

    static boot<M extends Middleware>(this: new () => M , app: express.Application): void {
        app.use((new this()).handle)
    }

}


export default Middleware