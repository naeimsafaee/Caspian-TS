import {DataTypes, Model} from 'sequelize';
import Coin from "./Coin";
import sequelize from "../Providers/DataBaseServiceProvider";
import Currency from "./Currency";

class PairBaseOnCurrency extends Model {

    static table_name = "pair_base_on_currencies";
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
        vs_currency_id: {
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
PairBaseOnCurrency.init(PairBaseOnCurrency.attributes, {
    sequelize: sequelize,
    tableName: PairBaseOnCurrency.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

PairBaseOnCurrency.belongsTo(Coin, {targetKey: 'id', foreignKey: 'coin_id', as: 'coin'});
PairBaseOnCurrency.belongsTo(Currency, {targetKey: 'id', foreignKey: 'vs_currency_id', as: 'vs_coin'});


export default PairBaseOnCurrency