import mongoose, {Schema, Document} from "mongoose";


// typeScript interface for User
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}


// define schema
const userSchema: Schema = new Schema(
    {
        username: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    }
    ,{timestamps: true}
);


export default mongoose.model<IUser>("User", userSchema)