import {DataTypes, Model} from 'sequelize';
import sequelize from "../Providers/DataBaseServiceProvider";
import Pair from "./Pair";
import PairBaseOnCurrency from "./PairBaseOnCurrency";

class ChangeBaseOnCurrency extends Model {

    static table_name = "change_base_on_currencies";
    static attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pair_id: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        price: {
            type: DataTypes.STRING,
        }
    }
    /* static query(): ModelStatic<any> {

         return ins;
     }*/
}
ChangeBaseOnCurrency.init(ChangeBaseOnCurrency.attributes, {
    sequelize: sequelize,
    tableName: ChangeBaseOnCurrency.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

ChangeBaseOnCurrency.belongsTo(PairBaseOnCurrency, {targetKey: 'id', foreignKey: 'pair_id', as: 'pair'});


export default ChangeBaseOnCurrency