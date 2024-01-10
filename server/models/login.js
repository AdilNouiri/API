import mongoose from 'mongoose';

const { Schema } = mongoose;

const LoginSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password required"]
    }
});

const Login = mongoose.model('login', LoginSchema);

export default Login;
