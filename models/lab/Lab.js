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
        pincode:{
            type:Number,
            required:true
        }
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
    sendRepots:[{
        submitDate:Date,
        healthID:Number,
        treatmentNo: Number,
        testName:String,
        attachment:String,
        remarks:String,

    }]
     
});

const Lab = mongoose.model("Lab", LabSchema);

module.exports = Lab;
