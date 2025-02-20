const mongoose = require('mongoose');

const SmsReportSchema = new mongoose.Schema({

    noofperson: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SmsReport", SmsReportSchema);