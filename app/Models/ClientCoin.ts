import {DataTypes , Model} from 'sequelize';
import sequelize from "../Providers/DataBaseServiceProvider";

class ClientCoin extends Model {

    static table_name = "client_coins";
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        client_id: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        coin_id: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        amount: {
            type: DataTypes.FLOAT,
        },
    }

}

ClientCoin.init(ClientCoin.attributes, {
    sequelize: sequelize,
    tableName: ClientCoin.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default ClientCoin