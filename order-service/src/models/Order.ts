import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrder extends Document {
    userID: Types.ObjectId;
    amount: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
};

const OrderSchema: Schema = new Schema(
    {
        userID: { 
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {type: Number, required: true},
        status: {type: String, required: true},
    },
    {timestamps: true},
);

const orderModel = mongoose.model<IOrder>("Order", OrderSchema);
export default orderModel;