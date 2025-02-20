const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const campaignSchema = new Schema(
  {
    ActiveInactiveProspect: {
      type: Boolean,
      default: false,
    },
    IsActive: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: String,
      // required: true,
      default: "admin",
    },
    assignFollowUps: {
      type: String,
      enum: ["Past", "Future", "Present"],
    },
    autoCallDuration: {
      type: String,
      default: "10",
    },
    callImmediately: {
      type: Boolean,
      default: true,
    },
    communication_type: {
      type: String,
      default: null,
    },
    createdBy: {
      type: String,
      // required: true,
      default: "admin",
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
    disposition: [
      {
        type: String,
        required: true,
      },
    ],
    enableAgentFilter: {
      type: Boolean,
      default: false,
    },
    enableAutoCalling: {
      type: Boolean,
      default: true,
    },
    enableDeleteProspect: {
      type: Boolean,
      default: false,
    },
    enableEditMessage: {
      type: Boolean,
      default: true,
    },
    enableMessageOnDisposition: {
      type: Boolean,
      default: false,
    },
    enable_message: {
      type: Boolean,
      default: false,
    },
    formFields: {
      type: Array,
      default: [],
    },
    helpScript: {
      type: String,
      default: "",
    },
    launchTime: {
      type: String,
      default: "",
    },
    mandatoryRemarks: {
      type: Boolean,
      default: true,
    },
    minimumSlotDuration: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumberMasking: {
      type: Boolean,
      default: false,
    },
    prospectFilter: {
      type: String,
      default: "None",
    },
    scheduleAppointment: {
      type: Boolean,
      default: false,
    },
    telephony: {
      type: String,
      default: "Default",
    },
    templateId: {
      type: String,
      default: null,
    },
    updatedOn: {
      type: Date,
      default: null,
    },
    viewType: {
      type: String,
      default: "Cycle Based",
    },
    workflow: {
      type: String,
      default: "Lead Generation",
    },
    additionalField: {
      type: String,
    },
    agentAssign: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CampaignModel = mongoose.model("crm_campaign", campaignSchema);

module.exports = CampaignModel;
