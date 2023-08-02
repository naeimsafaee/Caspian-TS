import {DataTypes, Model} from 'sequelize';
import sequelize from "../Providers/DataBaseServiceProvider";

class Network extends Model {

    static table_name = "networks";
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        persian_name: DataTypes.STRING,
        symbol: DataTypes.STRING,
        path: DataTypes.STRING,
        explorer: DataTypes.STRING,
        explorer_token: DataTypes.STRING,
    }

}

Network.init(Network.attributes, {
    sequelize: sequelize,
    tableName: Network.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Network