import {DataTypes, Model} from 'sequelize';
import Coin from "./Coin";
import sequelize from "../Providers/DataBaseServiceProvider";

class Pair extends Model {

    static table_name = "pairs";
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        coin_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            /*references: {
                model: Coin,
                key: 'id',
            }*/
        },
        vs_coin_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            /*references: {
                model: Coin,
                key: 'id',
            }*/
        }
    }


    /* static query(): ModelStatic<any> {

         return ins;
     }*/
}
Pair.init(Pair.attributes, {
    sequelize: sequelize,
    tableName: Pair.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

Pair.belongsTo(Coin, {targetKey: 'id', foreignKey: 'coin_id', as: 'coin'});
Pair.belongsTo(Coin, {targetKey: 'id', foreignKey: 'vs_coin_id', as: 'vs_coin'});


export default Pair