import {DataTypes, Model} from 'sequelize';
import sequelize from "../Providers/DataBaseServiceProvider";

class Currency extends Model {

    static table_name = "currencies";
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        persian_name: DataTypes.STRING,
        symbol: DataTypes.STRING,
        price: DataTypes.STRING,
    }

}

Currency.init(Currency.attributes, {
    sequelize: sequelize,
    tableName: Currency.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Currency