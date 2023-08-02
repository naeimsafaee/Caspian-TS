import Controller from "./Controller";
import express from "express";
import EthereumGenerator from "../../Helper/Address/EthereumGenerator";

const HDNode = require('ethers').utils.HDNode;

class AddressController extends Controller {

    constructor() {
        super();
    }

    /*public generate_x_pub() {
        let mnemonic = process.env.SEED;
        let masterNode = HDNode.fromMnemonic(mnemonic);
        // let xpriv = masterNode.extendedKey;

        const x_pub_key = masterNode.neuter().extendedKey;

        process.env.X_PUB_KEY = x_pub_key

        return x_pub_key
    }*/

    public async store(req: express.Request) {

        const new_address = await new EthereumGenerator(req.body.path).generate_new_address(req.body.index)

        console.log(new_address)

        return new_address;
    }

}


export default AddressController