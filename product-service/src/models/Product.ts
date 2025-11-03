import mongoose, { Schema, Document } from "mongoose";

// 定义 Product 数据的 TypeScript 接口 (Interface)
export interface IProduct extends Document {
    name: string;
    description?: string; // 描述是可选的
    price: number;
    stock: number; // 库存数量
    createdAt?: Date; // Mongoose 会自动添加 timestamps
    updatedAt?: Date;
}

// 定义 Mongoose Schema (模式)
const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true }, // 名称必填，去除前后空格
        description: { type: String, trim: true },
        price: { type: Number, required: true, min: 0 }, // 价格必填，最小为 0
        stock: { type: Number, required: true, min: 0, default: 0 } // 库存必填，最小为 0，默认为 0
    },
    { 
        timestamps: true // 自动添加 createdAt 和 updatedAt 字段
    }
);

// (可选) 添加索引以提高查询性能
ProductSchema.index({ name: 1 }); // 按名称索引

// 创建并导出 Mongoose 模型
const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
export default ProductModel;