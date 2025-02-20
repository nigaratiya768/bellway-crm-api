const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    status_name: {
      type: String,
      required: true,
      trim: true,
    },
    status_name1: {
      type: String,
    //  required: true, 
      trim: true,
    },
    status_index: {
      type: Number,
      trim: true,
    },
    status_status: {
      type: Number,
      default: 1,
      trim: true,
    },
    is_deletable: {
      type: Number,
      default: 1,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("crm_status", statusSchema);
