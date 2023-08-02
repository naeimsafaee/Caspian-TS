import {DataTypes, Model} from 'sequelize';
import Pair from "./Pair";
import Client from "./Client";
import sequelize from "../Providers/DataBaseServiceProvider";

class Offer extends Model {

    static table_name = "offers";
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

Offer.init(Offer.attributes, {
    sequelize: sequelize,
    tableName: Offer.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

Offer.belongsTo(Pair, {targetKey: 'id', foreignKey: 'pair_id', as: 'pair'});


export default Offer