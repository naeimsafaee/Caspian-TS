import {DataTypes, Model} from 'sequelize';
import sequelize from "../Providers/DataBaseServiceProvider";
import Client from "./Client";
import Coin from "./Coin";
import Network from "./Network";

class CoinNetwork extends Model {

    static table_name = "coin_networks";
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        coin_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Coin,
                key: 'id',
            }
        },
        network_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Network,
                key: 'id',
            }
        },
        network_fee: DataTypes.STRING,
        contract_address: DataTypes.STRING,
    }

}

CoinNetwork.init(CoinNetwork.attributes, {
    sequelize: sequelize,
    tableName: CoinNetwork.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default CoinNetwork