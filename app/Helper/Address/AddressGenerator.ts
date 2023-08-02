const bip39 = require("bip39");

abstract class AddressGenerator {

    abstract path: string;
    private private_key!: Buffer

    get_private_key() {
        return new Promise((resolve: (value: Buffer) => void, reject) => {
            if (this.private_key)
                resolve(this.private_key)
            bip39.mnemonicToSeed(process.env.SEED as string).then((addr: Buffer) => {
                this.private_key = addr
                resolve(addr)
            }).catch((err:any) => reject(err))
        })
    }

    /* let mnemonic = process.env.SEED;
     let masterNode = HDNode.fromMnemonic(mnemonic);

     let xpriv = masterNode.extendedKey;

     let extPubKey = masterNode.neuter().extendedKey;
*/
}

export default AddressGenerator