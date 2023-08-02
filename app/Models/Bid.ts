import {DataTypes, Model} from 'sequelize';
import Pair from "./Pair";
import Client from "./Client";
import sequelize from "../Providers/DataBaseServiceProvider";
import Change from "./Change";

class Bid extends Model {

    static table_name = "bids";
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
        pair_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Pair,
                key: 'id',
            }
        },
        amount: {
            type: DataTypes.NUMBER,
        },
        price: {
            type: DataTypes.NUMBER,
        },
        fill: {
            type: DataTypes.NUMBER,
        },
        is_fake: {
            type: DataTypes.BOOLEAN,
        },
        status: {
            type: DataTypes.ENUM('active', 'filled', 'canceled'),
        },
    }

}

Bid.init(Bid.attributes, {
    sequelize: sequelize,
    tableName: Bid.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

Bid.belongsTo(Pair, {targetKey: 'id', foreignKey: 'pair_id', as: 'pair'});



export default Bid