import {DataTypes, Model} from 'sequelize';
import Client from "./Client";
import sequelize from "../Providers/DataBaseServiceProvider";
import Network from "./Network";
import Coin from "./Coin";
import Pair from "./Pair";
import Bid from "./Bid";

class Address extends Model {

    static table_name = "addresses";
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        client_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Client,
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
        coin_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Coin,
                key: 'id',
            }
        },
        address: {
            type: DataTypes.STRING,
        },
        balance: {
            type: DataTypes.STRING,
        },
        contract_address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }

}

Address.init(Address.attributes, {
    sequelize: sequelize,
    tableName: Address.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

Address.belongsTo(Client, {targetKey: 'id', foreignKey: 'client_id', as: 'client'});
Address.belongsTo(Network, {targetKey: 'id', foreignKey: 'network_id', as: 'network'});
Address.belongsTo(Coin, {targetKey: 'id', foreignKey: 'coin_id', as: 'coin'});


export default Address