/*
import sequelize from '../Providers/DataBaseServiceProvider';
import {ModelStatic, Model as SeqModel} from 'sequelize';
import Coin from "./Coin";

class Orm  {

}

 class BaseModel extends SeqModel{
     table_name!: string;
     attributes!: {};

    static query<T extends BaseModel>(this: new() => T) {
        return new Model(new this())
    }
}


class Model<T extends BaseModel> {

    protected table_name!: string;
    private seq_instance;

    constructor(child: T) {
        this.seq_instance =
    }

    async create(payload: any): Promise<any> {
        return await this.seq_instance.create(payload)
    }

    async update(where: {}, payload: any): Promise<any> {
        /!*const ingredient = await child.findByPk(id)
        if (!ingredient) {
            throw new Error('not found')
        }*!/
        return await this.seq_instance.update(payload, {
            returning: true,
            where: {id: where}
        })
    }

    async findById(id: number): Promise<any> {
        const ingredient = await this.seq_instance.findByPk(id)
        if (!ingredient) {
            // @todo throw custom error
            throw new Error('not found')
        }
        return ingredient
    }

    async find(where: {}): Promise<any> {
        const ingredient = await this.seq_instance.findOne({
            where: where
        })
        if (!ingredient) {
            // @todo throw custom error
            throw new Error('not found')
        }
        return ingredient
    }

    async delete<T extends ModelStatic<any>>(this: T, id: number): Promise<boolean> {
        const deletedIngredientCount = await this.destroy({
            where: {id}
        })
        return !!deletedIngredientCount
    }

    async all(options: {} = {}): Promise<any[]> {
        return await this.seq_instance.findAll(options)
    }

    belongsTo(related: any) {
        this.seq_instance.belongsTo(Orm, {targetKey: 'id', foreignKey: 'coin_id', as: 'coin'});
    }

}


export default BaseModel*/
