const mongoose = require("mongoose");

const LabSchema = mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "doctor", "lab"],
        required: true,
    },
    profile: {
        labName: {
            type: String,
            required: true,
        },
        registrationNo: {
            type: String,
            required: true,
        },
        phoneNo: {
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
        pincode: {
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
    sentReports: [
        {
            submitDate: Date,
            patient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            treatmentNo: Number,
            testName: String,
            attachment: String,
            remarks: String,
        },
    ],
});

const Lab = mongoose.model("Lab", LabSchema);

module.exports = Lab;
