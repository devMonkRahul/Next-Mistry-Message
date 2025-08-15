import mongoose, { Schema, model, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}) 

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [/.+@.+\..+/, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    verifyCode: {
        type: String,
        required: [true, 'Please provide a verification code']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Please provide a verification code expiry']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: false
    },
    messages: [messageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || model<User>('User', userSchema);

export default UserModel;