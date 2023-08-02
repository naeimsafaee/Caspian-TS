import Controller from "./Controller";
import {WebSocket} from "../../../routes/socket";
import express from "express";

interface SocketData {
    socket_id: string
    coin_symbol: string
    vs_coin_symbol: string
    price?: string
    amount?: string
    is_bid: boolean
}

class OrderController extends Controller {

    public static instance: OrderController;
    private socket_ids: Array<SocketData> = [];

    constructor() {
        super();
        OrderController.instance = this
    }

    public index() {
        return "working!"
    }

    public store(req: express.Request) {

        OrderController.instance.socket_ids.map((socket_data) => {

            if (socket_data.coin_symbol.toLowerCase() == req.body.coin_symbol.toLowerCase()) {

                console.log("sending order " + socket_data.coin_symbol.toLowerCase() + " to " + socket_data.socket_id)

                socket_data.price = req.body.price
                socket_data.amount = req.body.amount
                socket_data.is_bid = req.body.is_bid
                OrderController.instance.emit_order(socket_data)

            }

        })
        return true;
    }


    fetch_sockets(socket_data: SocketData) {

        let exists_socket_id = false;
        for (let i = 0; i < this.socket_ids.length; i++)
            if (this.socket_ids[i].socket_id === socket_data.socket_id) {

                this.socket_ids[i] = socket_data;

                exists_socket_id = true;
            }

        if (!exists_socket_id)
            this.socket_ids.push(socket_data)

    }

    remove_socket(socketData: SocketData) {
        this.socket_ids = this.socket_ids.filter(socket_data => socket_data.socket_id !== socketData.socket_id);
    }

    emit_order(socketData: SocketData) {
        WebSocket.instance.io.sockets.to(socketData.socket_id).emit('order_book', {
            price: socketData.price,
            amount: socketData.amount,
            coin: socketData.coin_symbol,
            vs_coin: socketData.vs_coin_symbol,
            is_bid: socketData.is_bid
        })

    }

}


export default OrderController