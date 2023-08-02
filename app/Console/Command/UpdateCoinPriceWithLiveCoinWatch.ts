import Command from './Command';
import Coin from "../../Models/Coin";

import {WebSocket} from '../../../routes/socket';
import axios from "axios";
import Change from "../../Models/Change";
import Pair from "../../Models/Pair";

interface SocketData {
    socket_id: string;
    coin_symbol: string;
    vs_coin_symbol: string;
    price?: string;
}

class UpdateCoinPriceWithLiveCoinWatch extends Command {

    public static instance: UpdateCoinPriceWithLiveCoinWatch;
    private socket_ids: Array<SocketData> = [];

    constructor() {
        super();
        UpdateCoinPriceWithLiveCoinWatch.instance = this
    }

    async handle() {
        return;
        console.log("updating coin prices");

        axios.post(process.env.LIVE_COIN_WATCH_BASE_URL + '/coins/list',
            JSON.stringify(
                {
                    "currency": "USD",
                    "sort": "rank",
                    "order": "ascending",
                    "offset": 0,
                    "limit": 50,
                    "meta": true
                }
            ), {
                headers: {
                    'content-type': 'application/json',
                    'x-api-key': process.env.LIVE_COIN_WATCH as string
                }
            }).then(async (response) => {

            // console.log(response.data);

            for (let i = 0; i < response.data.length; i++) {
                const current_data = response.data[i];

                const volume = current_data.volume;
                const price = current_data.rate;
                const symbol = current_data.code;

                await Coin.update({
                        price: price,
                        volume: volume
                    },
                    {
                        where: {
                            symbol: symbol
                        }
                    }
                )

                UpdateCoinPriceWithLiveCoinWatch.instance.socket_ids.map((socket_data) => {

                    socket_data.price = price
                    if (socket_data.coin_symbol.toLowerCase() == symbol.toLowerCase()) {

                        console.log("sending " + socket_data.coin_symbol.toLowerCase() + " to " + socket_data.socket_id + " , price : " + price)

                        UpdateCoinPriceWithLiveCoinWatch.instance.emit_coin(socket_data)
                    }

                })
            }

            const pairs = await Pair.findAll({include: ['coin' , 'vs_coin']})

            pairs.map(async (pair: any) => {

                const coin_price = pair.coin.price;
                const vs_coin_price = pair.vs_coin.price;

                await Change.create({
                    'pair_id' : pair.id,
                    'price' : coin_price / vs_coin_price
                })

            })

        }).catch(error => console.log(error))

    }

    get_interval_time(): number {
        return 1000 * 30 /** 100*/;
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

    emit_coin(socketData: SocketData) {
        WebSocket.instance.io.sockets.to(socketData.socket_id).emit('coin_pair', {
            price: socketData.price,
            coin: socketData.coin_symbol,
            vs_coin: socketData.vs_coin_symbol
        })
    }

    remove_socket(socketData: SocketData) {
        this.socket_ids = this.socket_ids.filter(socket_data => socket_data.socket_id !== socketData.socket_id);
    }

}

export default UpdateCoinPriceWithLiveCoinWatch