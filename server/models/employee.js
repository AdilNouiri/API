import mongoose from 'mongoose';

const { Schema } = mongoose;

const EmployeeSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "Name required"]
    },
    secondname: {
        type: String,
        required: [true, "Name required"]
    },
    phone: Number,
    poste: {
        type: String,
        default: "Cafe-maker"
    },
    privilege: Boolean
});

const Employee = mongoose.model('employee', EmployeeSchema);

export default Employee;
