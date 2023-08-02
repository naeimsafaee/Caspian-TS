import {DataTypes , Model} from 'sequelize';
import sequelize from "../Providers/DataBaseServiceProvider";

class Client extends Model {

    static table_name = "clients";
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    }

}

Client.init(Client.attributes, {
    sequelize: sequelize,
    tableName: Client.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Client