import Command from './Command';
import Network from "../../Models/Network";
import Explorer from "../../Helper/Explorer/Explorer";
import Address from "../../Models/Address";
import NetworkAddress from "../../Helper/Explorer/NetworkAddress";
import ClientCoin from "../../Models/ClientCoin";

class CheckDeposit extends Command {

    constructor() {
        super();
    }

    async handle() {
        console.log("check deposit");

        const networks = await Network.findAll();

        for (let i = 0; i < networks.length; i++) {

            const current_network: any = networks[i];

            if (current_network.explorer == null)
                continue;

            const explorer: Explorer = new (require("../../Helper/Explorer/" + current_network.explorer).default)(current_network.explorer_token)

            const addresses = await Address.findAll({
                where: {network_id: current_network.id}
            })

            for (let j = 0; j < addresses.length; j++) {
                const address = addresses[j] as any;
                const account = await explorer.get_balance(new NetworkAddress(
                    address.address,
                    address.balance,
                    address.contract_address
                ))

                if (account.diff_balance != 0) {

                    console.log(account)

                    await Address.update({
                            balance: account.balance
                        }, {
                            where: {
                                network_id: current_network.id,
                                address: account.address,
                                contract_address: account.contract_address
                            }
                        }
                    )

                    await ClientCoin.update({
                        amount: account.balance
                    }, {
                        where: {
                            client_id: address.client_id,
                            coin_id: address.coin_id,
                        }
                    })

                }

            }

        }


    }

    get_interval_time(): number {
        return 1000 * 60 * 10;
    }

}

export default CheckDeposit