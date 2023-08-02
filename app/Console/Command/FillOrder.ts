import Command from './Command';
import Bid from "../../Models/Bid";
import Offer from "../../Models/Offer";
import ClientCoin from "../../Models/ClientCoin";
import sequelize from "../../Providers/DataBaseServiceProvider";
import {WebSocket} from "../../../routes/socket";

interface SocketData {
    socket_id: string
    socket: any
    id: string
    is_bid: boolean
}

class FillOrder extends Command {

    public static instance: FillOrder;
    private socket_ids: Array<SocketData> = [];

    constructor() {
        super();
        FillOrder.instance = this
    }

    async handle() {
        console.log("fill order");

        const bids = await Bid.findAll({
            where: {
                status: "active",
                is_fake: false,
            },
            include: {all: true, nested: true}
        })

        bids.map(async (bid: any) => {

            const coin = bid.pair.coin;
            const vs_coin = bid.pair.vs_coin;

            const current_coin_price = bid.price;

            const coin_price = coin.price / vs_coin.price;

            let top = coin_price + (coin_price * 0.1 / 100);
            let down = coin_price - (coin_price * 0.1 / 100);

            // console.log(top)
            // console.log(down)

            if (current_coin_price <= top && current_coin_price >= down) {

                await bid.update(
                    {status: 'filled' , fill: 100},
                );

                await ClientCoin.update(
                    {amount: sequelize.literal('amount - ' + (bid.amount * bid.price))},
                    {where: {coin_id: vs_coin.id, client_id: bid.client_id}}
                );

                await ClientCoin.update(
                    {amount: sequelize.literal('amount + ' + bid.amount)},
                    {where: {coin_id: coin.id, client_id: bid.client_id}}
                );

                FillOrder.instance.socket_ids.map((socket_data) => {

                    socket_data.is_bid = true
                    socket_data.id = bid.id

                    FillOrder.instance.emit_order(socket_data)
                })
            }
        })

        const offers = await Offer.findAll({
            where: {
                status: "active",
                is_fake: false,
            },
            include: {all: true, nested: true}
        })

        offers.map(async (offer: any) => {

            const coin = offer.pair.coin;
            const vs_coin = offer.pair.vs_coin;

            const current_coin_price = offer.price;

            const coin_price = coin.price / vs_coin.price;

            let top = coin_price + (coin_price * 0.1 / 100);
            let down = coin_price - (coin_price * 0.1 / 100);

            if (current_coin_price <= top && current_coin_price >= down) {

                await offer.update(
                    {status: 'filled' , fill: 100},
                );

                await ClientCoin.update(
                    {amount: sequelize.literal('amount + ' + (offer.amount * offer.price))},
                    {where: {coin_id: vs_coin.id, client_id: offer.client_id}}
                );

                await ClientCoin.update(
                    {amount: sequelize.literal('amount - ' + offer.amount)},
                    {where: {coin_id: coin.id, client_id: offer.client_id}}
                );

                FillOrder.instance.socket_ids.map((socket_data) => {
                    socket_data.is_bid = false
                    socket_data.id = offer.id

                    FillOrder.instance.emit_order(socket_data)
                })
            }
        })

    }

    get_interval_time(): number {
        return 1000 * 3;
    }

    remove_socket(socketData: SocketData) {
        this.socket_ids = this.socket_ids.filter(socket_data => socket_data.socket_id !== socketData.socket_id);
    }

    emit_order(socketData: SocketData) {

        socketData.socket.emit('fill_order' , {
            id: socketData.id,
            is_bid: socketData.is_bid
        })

        /*WebSocket.instance.io.sockets.to(socketData.socket_id).emit('fill_order', {
            id: socketData.id,
            is_bid: socketData.is_bid
        })*/
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
}

export default FillOrder