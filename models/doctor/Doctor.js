const mongoose = require("mongoose");
const DoctorSchema = mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "doctor", "lab"],
        required: true,
    },
    profile: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        mobileNo: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
        specialization: {
            type: String,
            required: true,
        },
        mcirno: {
            type: Number,
            required: true,
        },
    },
    account: {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        resetToken: {
            type: String,
            default: undefined,
        },
        resetTokenExpiration: Date,
    },
    currentPatients: [
        {
            healthID:Number,
            treatmentNo: Number,
            doctorName:String,
            history: String,
            labReports:{
                labName:String,
                submitDate:Date,
                testName:String,
                treatmentNo:Number,
                attachment:String,
                remarks:String, 
            },
            patient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            prescriptions: String,
            medicines:{
                name:[String],
                time:[String],
            },
            response: String,
            startDate: Date,
            endDate: Date,
        },
    ],
    previousPatients: [{
            healthID:Number,
            treatmentNo: Number,
            doctorName:String,
            history: String,
            labReports:{
                labName:String,
                submitDate:Date,
                testName:String,
                treatmentNo:Number,
                attachment:String,
                remarks:String, 
            },
            patient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            prescriptions: String,
            medicines:{
                name:[String],
                time:[String],
            },
            response: String,
            startDate: Date,
            endDate: Date,
    }],
});

const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;
