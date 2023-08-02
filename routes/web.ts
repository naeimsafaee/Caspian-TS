import express from "express";
import Controller from '../app/Http/Controller/Controller'
import OrderController from "../app/Http/Controller/OrderController";
import AddressController from "../app/Http/Controller/AddressController";

const router = express.Router();

class Route {

    static post<T extends Controller>(uri: string, controller: { controller: new() => T, func: string }) {

        const _controller = new controller.controller() as any;

        router.post(uri, async (req: express.Request, res: express.Response) => {
            return res.send(await _controller[controller.func](req))
        })
    }

    static get<T extends Controller>(uri: string, controller: { controller: new() => T, func: string }) {

        const _controller = new controller.controller() as any;

        router.get(uri, async  (req: express.Request, res: express.Response) => {
            return res.send(await _controller[controller.func](req))
        })
    }
}


Route.get('/', {controller: OrderController, func: 'index'})
Route.post('/order', {controller: OrderController, func: 'store'})

Route.post('/address' , {controller: AddressController , func: 'store'})
// Route.get('/generate_x_pub' , {controller: AddressController , func: 'generate_x_pub'})


module.exports = router;
