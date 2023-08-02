import axios from "axios";
import Explorer from "./Explorer";
import NetworkAddress from "./NetworkAddress";

class BinanceSmartChainExplorer extends Explorer {

    private base_url = "https://api.bscscan.com/";
    private token = "";

    constructor(token: string) {
        super();
        this.token = token
    }

    public get_balance(account: NetworkAddress): Promise<NetworkAddress> {

        let method = "balancemulti";
        if (account.is_token)
            method = "tokenbalance";

        let url = this.base_url + "api" +
            "?module=account" +
            "&action=" + method +
            "&address=" + account.address +
            "&tag=latest" +
            "&apikey=" + this.token;

        if (account.is_token)
            url += "&contractaddress=" + account.contract_address;

        return new Promise((resolve: (value: NetworkAddress) => void, reject) => {
            axios.get(url, {})
                .then(async (response) => {

                    let amount;
                    if (account.is_token) {
                        amount = response.data.result;
                    } else {
                        amount = response.data.result[0].balance;
                    }

                    account.set_balance(Explorer.WeiToEth(parseFloat(amount)));

                    resolve(account)
                })
                .catch(error => console.log(error));
        });
    }

}

export default BinanceSmartChainExplorer