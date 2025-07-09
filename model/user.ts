import mongoose, {Schema,Document,mongo} from "mongoose";

export interface IUser extends Document {
    name: string,
    password: string,
    email: string,
    city: string,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true 
});

const UserModel = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", UserSchema);

export default UserModel;