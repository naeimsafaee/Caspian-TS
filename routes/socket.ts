import * as http from "http";
import {Server} from "socket.io"
import UpdateCoinPrice from "../app/Console/Command/UpdateCoinPrice";
import OrderController from "../app/Http/Controller/OrderController";
import EventEmitter from "events";
import FakeOrder from "../app/Console/Command/FakeOrder";
import FillOrder from "../app/Console/Command/FillOrder";

interface ServerToClientEvents {
    coin_pair: (c: PriceResponseData) => void;
    order_book: (c: OrderBookResponseData) => void;
    fill_order: (c: FillOrderResponseData) => void;
}

interface ClientToServerEvents {
    coin_pair: (c: PriceRequestData) => void;
    order_book: (c: PriceRequestData) => void;
    fill_order: (c: FillOrderRequestData) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface FillOrderRequestData {
    socket_id: string
}

interface PriceRequestData {
    is_internal: boolean
    coin: string
    vs_coin: string
}

interface PriceResponseData {
    price: string
    coin: string
    vs_coin: string
}

interface OrderBookResponseData {
    is_bid: boolean
    amount: string
    price: string
}

interface FillOrderResponseData {
    socket_id: string
    id: string
    is_bid: boolean
}


class WebSocket extends EventEmitter {

    public io: Server;
    public static instance: WebSocket;

    constructor(server: http.Server) {
        super()

        //<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
        const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(server, {
            cors: {
                origin: ["http://127.0.0.1:8000", 'https://caspianexe.com']
            }
        })
        this.io = io
        WebSocket.instance = this

        io.on('connection', (socket) => {
            console.log('a user connected with socket id : ' + socket.id);
            const socket_id = socket.id

            socket.on('order_book', (data: PriceRequestData) => {
                OrderController.instance.fetch_sockets({
                    socket_id: socket_id, coin_symbol: data.coin, vs_coin_symbol: data.vs_coin, is_bid: false
                })

                FakeOrder.instance.fetch_sockets({
                    socket_id: socket_id, coin_symbol: data.coin, vs_coin_symbol: data.vs_coin, is_bid: false
                })

                UpdateCoinPrice.instance.fetch_sockets({
                    socket_id: socket_id, coin_symbol: data.coin, vs_coin_symbol: data.vs_coin
                })

                FillOrder.instance.fetch_sockets({
                    socket: socket, id: "", is_bid: false,socket_id: socket_id,
                })
            })

            socket.on('disconnect', () => {
                console.log(`user ${socket.id} disconnected`);
                UpdateCoinPrice.instance.remove_socket({
                    socket_id: socket_id, coin_symbol: "", vs_coin_symbol: ""
                })
                OrderController.instance.remove_socket({
                    socket_id: socket_id, coin_symbol: "", vs_coin_symbol: "", is_bid: false
                })
                FakeOrder.instance.remove_socket({
                    socket_id: socket_id, coin_symbol: "", vs_coin_symbol: "", is_bid: false
                })
                FillOrder.instance.remove_socket({
                    socket_id: socket_id, id: "", is_bid: false , socket: socket
                })
            });

        })

    }

    /*static run_server(server: http.Server) {

        io.on("connection", (socket) => {

            console.log('a user connected with socket id : ' + socket.id);

            //to user only
            socket.emit("noArg");
            socket.emit("basicEmit", 1, "2", Buffer.from([3]));
            socket.emit("withAck", "4", (e) => {
                // e is inferred as number
            });

            // works when broadcast to all
            //to all except sender
            io.emit("noArg");

            // works when broadcasting to a room
            io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));

            socket.on("hello", () => {
                socket.data.name = "john";
                socket.data.age = 42;
            });

            socket.on('hello', (obj) => {
                // console.log(users);

                const token = obj.name;

                //to user only
                /!*socket.emit('message', {
                    type: message_types.from_app,
                    text: `hi ${data.fullname} , welcome to our chat app`
                });*!/

                //to all users
                /!*socket.broadcast.emit("message", {
                    type: message_types.from_app,
                    text: `${data.fullname} has joined the chat!`
                })*!/

                //to all except sender
                // io.emit('message', {type: message_types.sender, text: obj.text});


            });

            socket.on('disconnect', () => {
                console.log('a user disconnected');
                // io.emit("message", {type: message_types.from_app, text: `${user} has left the chat`})
            });
        });

    }*/


}

export {WebSocket}
