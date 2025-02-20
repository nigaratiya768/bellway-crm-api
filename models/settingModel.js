const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      trim: true,
    },
    contact_person: {
      type: String,
      trim: true,
    },
    company_email: {
      type: String,
      trim: true,
    },
    company_mobile: {
      type: Number,
      trim: true,
    },
    website_name: {
      type: String,
      trim: true,
    },
    company_pan: {
      type: String,
      trim: true,
    },
    company_address: {
      type: String,
      trim: true,
    },
    company_zip_code: {
      type: String,
      trim: true,
    },
    company_city: {
      type: String,
      trim: true,
    },
    company_state: {
      type: String,
      trim: true,
    },
    company_country: {
      type: String,
      trim: true,
    },
    company_gst: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("crm_setting", settingSchema);
