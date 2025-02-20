const mongoose = require("mongoose");

const callLogSchema = new mongoose.Schema(
  {
    user_id: {
      // prospect id
      type: mongoose.Schema.ObjectId,
      ref: "crm_prospects",
      required: true,
    },
    agent_id: {
      type: mongoose.Schema.ObjectId,
      ref: "crm_agent",
     // required: true,
    },
    agentEmail: {
      type: String,
      trim: true,
    },
    callStatus: {
      type: String,
      trim: true,
      default: "Not Answered",
    },
    callInitiatedTime: {
      type: String,
      trim: true,
    },
    callEndTime: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      trim: true,
    },
    phone_number: {
      type: Number,
      trim: true,
    },
    callType: {
      type: Number,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("crm_calllog", callLogSchema);
