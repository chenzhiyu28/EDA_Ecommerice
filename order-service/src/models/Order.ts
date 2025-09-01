import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrder extends Document {
    user: Types.ObjectId;
    amount: number;
    status: string;
};

const OrderSchema: Schema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId,
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