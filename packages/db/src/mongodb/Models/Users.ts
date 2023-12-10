import mongoose from "mongoose";

//export interface UserType extends mongoose.Document {
//    username: String;
//    password: String;
//}

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
