import {Server, Socket} from "socket.io"
import moment from "moment";
import {Op} from "sequelize";
import Command from './Command';
import {WebSocket} from '../../../routes/socket';
import Bid from "../../Models/Bid";
import Client from "../../Models/Client";
import Pair from "../../Models/Pair";
import Utility from "../../Helper/Utility";
import Offer from "../../Models/Offer";

interface SocketData {
    socket_id: string
    coin_symbol: string
    vs_coin_symbol: string
    price?: string
    amount?: string
    is_bid: boolean
}

class FakeOrder extends Command {

    public static instance: FakeOrder;
    private socket_ids: Array<SocketData> = [];
    private static system_client: any = false;
    private static amount = [0.1, 0.2, 0.01, 0.02, 0.3, 0.03, 0.0005, 0.1, 0.2, 0.01, 0.02, 0.3, 0.03, 0.0005, 0.1, 0.2, 0.01, 0.02, 0.3, 0.03, 0.0005, 1, 2, 3];

    constructor() {
        super();
        FakeOrder.instance = this
    }

    async handle() {
        console.log("fake order");

        if(FakeOrder.instance.socket_ids.length === 0)
            return
        if (!FakeOrder.system_client)
            FakeOrder.system_client = await Client.findOne({
                where: {
                    name: 'System'
                }
            })

        const last_min = moment().subtract(1, 'minute').toDate();

        const pairs = await Pair.findAll({include: ['coin' , 'vs_coin']})

        pairs.map(async (pair: any) => {

            const bids = await Bid.findAll({
                where: {
                    pair_id: pair.id,
                    created_at: {
                        [Op.gt]: last_min,
                    }
                }
            })

            const offers = await Offer.findAll({
                where: {
                    pair_id: pair.id,
                    created_at: {
                        [Op.gt]: last_min,
                    }
                }
            })

            let new_offer = {pair: '' , price: 0 , amount: 0};
            let new_bid = {pair: '' , price: 0 , amount: 0};

            const price = parseFloat(pair.coin.price)

            if (bids.length === 0) {

                const random_num = Utility.random(0, FakeOrder.amount.length);

                const temp_price = price - (price * 1 / 100)
                const temp_amount = FakeOrder.amount[random_num >= FakeOrder.amount.length ? 0 : random_num]

                new_bid = {
                    pair: pair.coin.symbol + "-" + pair.vs_coin.symbol ,
                    price : temp_price ,
                    amount : temp_amount ,
                }

                await Bid.create({
                    client_id: FakeOrder.system_client.id,
                    pair_id: pair.id,
                    amount: temp_amount,
                    price: temp_price,
                    is_fake: true
                })
            }


            if (offers.length === 0) {

                const random_num = Utility.random(0, FakeOrder.amount.length);

                const temp_price = price - (price * 1 / 100)
                const temp_amount = FakeOrder.amount[random_num >= FakeOrder.amount.length ? 0 : random_num]

                new_offer = {
                    pair: pair.coin.symbol + "-" + pair.vs_coin.symbol ,
                    price : temp_price,
                    amount : temp_amount,
                }

                await Offer.create({
                    client_id: FakeOrder.system_client.id,
                    pair_id: pair.id,
                    amount: temp_amount,
                    price: temp_price,
                    is_fake: true
                })
            }

            FakeOrder.instance.socket_ids.map((socket_data) => {

                if ((socket_data.coin_symbol + "-" + socket_data.vs_coin_symbol).toLowerCase()
                    == new_offer.pair.toLowerCase()) {

                    console.log("sending order " + (socket_data.coin_symbol + "-" + socket_data.vs_coin_symbol) + " to " + socket_data.socket_id)

                    socket_data.price = new_offer.price + ''
                    socket_data.amount = new_offer.amount + ''
                    socket_data.is_bid = false
                    FakeOrder.instance.emit_order(socket_data)
                }

                if ((socket_data.coin_symbol + "-" + socket_data.vs_coin_symbol).toLowerCase()
                    == new_bid.pair.toLowerCase()) {

                    console.log("sending order " + (socket_data.coin_symbol + "-" + socket_data.vs_coin_symbol) + " to " + socket_data.socket_id)

                    socket_data.price = new_bid.price + ''
                    socket_data.amount = new_bid.amount + ''
                    socket_data.is_bid = true
                    FakeOrder.instance.emit_order(socket_data)
                }

            })
        })

    }

    get_interval_time(): number {
        return 1000 * 5;
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
            is_bid: socketData.is_bid,
        })
    }

}

export default FakeOrder