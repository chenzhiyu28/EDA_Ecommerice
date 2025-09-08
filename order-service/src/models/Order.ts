import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrder extends Document {
    userID: Types.ObjectId;
    amount: number;
    status: "pending" | "paid" | "shipped" | "cancelled";
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
        status: {type: String, enums: ["pending", "paid", "shipped", "cancelled"], required: true},
    },
    {timestamps: true},
);

OrderSchema.index({ user:1, createdAt: -1});

const orderModel = mongoose.model<IOrder>("Order", OrderSchema);
export default orderModel;