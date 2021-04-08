const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "doctor", "lab"],
        required: true,
    },
    accessID: {
        healthID: {
            type: Number,
            required: true,
        },
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
        DOB: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        bloodGroup: {
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
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
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
    medical: {
        filled: Boolean,
        medicalDiagnosis: String,
        allergies: [String],
        functionalStatus: String,
        equipmentDevice: String,
    },
    previousTreatments: [
        {
            treatmentNo:Number,
            history: String,
            labReports: String,
            doctor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Doctor",
            },
            medicines: { medicineName: String, time: String },
            prescriptions: String,
            response: String,
            startDate: Date,
            endDate: Date,
        },
    ],
    currentTreatments: [
        {
            treatmentNo:Number,
            history: String,
            labReports: String,
            doctor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Doctor",
            },
            prescriptions: String,
            medicines: { medName: String, time: String },
            response: String,
            startDate: Date,
            endDate: Date,
        },
    ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
