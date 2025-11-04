import mongoose, { Document, Schema } from "mongoose";


// user object interface (field name must 100% match Schema)
export interface IUsercache extends Document {
    _id: string; // 直接使用 user-service 中 user 的 _id 
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// mongoose schema
const UserCacheSchema: Schema = new Schema(
    // 1st {}: fields
    {
        // 默认 Mongoose 会创建 ObjectId，但这里要覆盖它
        _id: { type: String, required: true},
        email: { type: String, reqired: true},
    },
    // 2nd {}: optional config
    {
        timestamps: true, // 自动添加 createdAt 和 updatedAt
        _id: false // 告诉 Mongoose 不要自动生成 _id，因为我们会自己提供
    }
)

// 3. 创建并导出模型
// Mongoose 将在 order-db 数据库中创建一个名为 "usercaches"(lowercase) 的集合 (collection)
const UserCacheModel = mongoose.model<IUsercache>("UserCache", UserCacheSchema);
export default UserCacheModel;