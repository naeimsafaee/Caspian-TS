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

class UpdateCoinPrice extends Command {

    public static instance: UpdateCoinPrice;
    private socket_ids: Array<SocketData> = [];

    constructor() {
        super();
        UpdateCoinPrice.instance = this
    }

    async handle() {
        console.log("updating coin prices");

        const coins = await Coin.findAll({}) as any;

        const promises = [];

        for (let i = 0; i < coins.length; i++) {
            if (coins[i].symbol == "USDT")
                continue;
            promises.push(
                axios.get(process.env.BINANCE_BASE_URL + '/api/v3/ticker/price'
                    + `?symbol=${coins[i].symbol.toUpperCase()}USDT`).then(async (response) => {

                    const current_data = response.data;

                    // const volume = current_data.volume;
                    const price = current_data.price;
                    const symbol = coins[i].symbol;

                    await coins[i].update({
                            price: price,
                        }
                    )

                    UpdateCoinPrice.instance.socket_ids.map((socket_data) => {

                        socket_data.price = price
                        if (socket_data.coin_symbol.toLowerCase() == symbol.toLowerCase()) {

                            console.log("sending " + socket_data.coin_symbol.toLowerCase() + " to " + socket_data.socket_id + " , price : " + price)

                            UpdateCoinPrice.instance.emit_coin(socket_data)
                        }

                    })

                }).catch(error => console.log(error))
            )
        }

        await Promise.all(promises);

        const pairs = await Pair.findAll({include: ['coin', 'vs_coin']})

        pairs.map(async (pair: any) => {

            const coin_price = pair.coin.price;
            const vs_coin_price = pair.vs_coin.price;

            await Change.create({
                'pair_id': pair.id,
                'price': coin_price / vs_coin_price
            })

        })

    }

    get_interval_time(): number {
        return 1000 * 3 /** 100*/;
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

export default UpdateCoinPrice