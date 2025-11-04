import mongoose, { Document, Schema } from "mongoose";


// Document interface
export interface IProductCache extends Document {
    _id: string;
    name: string;
    price: number;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}


// mongoose schema
const ProductCacheSchema: Schema = new Schema(
    {
        _id: {type: String, required: true},
        name: {type: String, required: true},
        price: {type: Number, required: true},
        stock: {type: Number, required: true},
    }, 
    {
        timestamps: true,
        _id: false,
    }
)


// ODM model
const ProductCacheModel = mongoose.model<IProductCache>("ProductCache", ProductCacheSchema);
export default ProductCacheModel;