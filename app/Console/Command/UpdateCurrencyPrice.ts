import Command from './Command';
import Currency from "../../Models/Currency";
import axios from "axios";
import Pair from "../../Models/Pair";
import Change from "../../Models/Change";
import PairBaseOnCurrency from "../../Models/PairBaseOnCurrency";
import ChangeBaseOnCurrency from "../../Models/ChangeBaseOnCurrency";

interface CurrencyData {
    value: string
    change: Number
    timestamp: Number
    date: string
}

class UpdateCurrencyPrice extends Command {

    constructor() {
        super();
    }

    async handle() {
        console.log("updating currency prices");

        axios.get(process.env.NAVASAN_BASE_URL + `/latest/?api_key=${process.env.NAVASAN_API_TOKEN}`)
            .then(async (response) => {

                const data = response.data as Array<CurrencyData>

                for (let key in data) {

                    await Currency.update({
                            price: data[key].value
                        },
                        {
                            where: {
                                symbol: key
                            }
                        }
                    )
                }

            }).catch(error => console.log(error))

        const pairs_base_on_currency = await PairBaseOnCurrency.findAll({include: ['coin', 'vs_coin']})

        const tether = await Currency.findOne({
            where: {
                symbol : 'usdt'
            }
        }) as any

        pairs_base_on_currency.map(async (pair: any) => {

            const coin_price = pair.coin.price;
            const vs_coin_price = pair.vs_coin.price;

            console.log(coin_price + "/" + vs_coin_price)

            await ChangeBaseOnCurrency.create({
                'pair_id': pair.id,
                'price': coin_price * tether.price
            })

        })
    }

    get_interval_time(): number {
        return 1000 * 60 * 60 * 12;
    }


}

export default UpdateCurrencyPrice