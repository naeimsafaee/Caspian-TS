import NetworkAddress from "./NetworkAddress";

const Decimal = require('decimal.js')
const WEI = 1000000000000000000

abstract class Explorer {

    protected static WeiToEth = (amount: number) => new Decimal(amount).div(WEI);

    abstract get_balance(account:NetworkAddress): Promise<NetworkAddress>;

    protected get_token_balance(account:NetworkAddress){

    };

}


export default Explorer