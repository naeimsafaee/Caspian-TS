import Wallet, {hdkey} from 'ethereumjs-wallet'
import AddressGenerator from "./AddressGenerator";
import * as Buffer from "buffer";


class EthereumGenerator extends AddressGenerator {

    path = "m/44'/60'/0'/0";

    constructor(path: string = "") {
        super()
        if (path)
            this.path = path;
    }

    async generate_new_address(index: number) {
        const seed = await this.get_private_key()

        return hdkey.fromMasterSeed(seed).derivePath(this.path).deriveChild(index).getWallet().getAddressString()
    }


}

export default EthereumGenerator