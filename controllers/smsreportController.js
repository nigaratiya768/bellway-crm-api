const SmsReport = require('../models/SmsReportModel');
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
exports.addSmsReport = catchAsyncErrors(async (req, res, next) => {
    const smsreport = await SmsReport.create(req.body.updated);
    res.status(201).json({
        success: true,
        smsreport,
        message: "Message Added Successfully....",
        message1: "Message Has Been Send Successfully...."
    });
});
exports.getAllSmsReport = catchAsyncErrors(async (req, res, next) => {
    const smsreport = await SmsReport.find();
    res.status(200).json({
        success: true,
        smsreport
    })
})