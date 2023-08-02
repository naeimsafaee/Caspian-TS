import {DataTypes, Model} from 'sequelize';
import sequelize from "../Providers/DataBaseServiceProvider";
import Pair from "./Pair";

class Change extends Model {

    static table_name = "changes";
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
Change.init(Change.attributes, {
    sequelize: sequelize,
    tableName: Change.table_name,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

Change.belongsTo(Pair, {targetKey: 'id', foreignKey: 'pair_id', as: 'pair'});


export default Change