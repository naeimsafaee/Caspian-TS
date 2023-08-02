import {DataTypes , Model} from 'sequelize'
import sequelize from "../Providers/DataBaseServiceProvider";

class Coin extends Model {

    static table_name = "coins"
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        persian_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        symbol: DataTypes.STRING,
        icon: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.STRING,
        },
        volume: DataTypes.STRING,
        internal_volume: DataTypes.STRING,
        change: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }

}

Coin.init(Coin.attributes, {
    sequelize: sequelize,
    tableName: Coin.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

export default Coin