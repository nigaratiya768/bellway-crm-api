const mongoose = require("mongoose");

const prospectSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "crm_agent",
    },
    assignTo: {
      type: String,
      trim: true,
      default: "N/A",
    },
    source: {
      type: String,
      required: true,
      default: "bulk upload",
    },
    assignPhone: {
      type: String,
      trim: true,
    },
    disposition: {
      type: String,
      trim: true,
      default: "Lead Generation",
    },
    remarks: {
      type: String,
      trim: true,
    },
    campaignName: {
      type: String,
      trim: true,
      default: "N/A",
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "crm_campaigns",
    },
    lastCaller: {
      type: String,
      trim: true,
    },
    lastCallDate: {
      type: Date,
    },
    scheduledDate: {
      type: Date,
    },
    totalCalls: {
      type: Number,
      default: 0,
    },
    callLogId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "crm_calllog",
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("crm_prospects", prospectSchema);
