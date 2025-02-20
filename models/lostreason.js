const mongoose = require("mongoose");

const lostreasonSchema = new mongoose.Schema(
  {
    lost_reason_name: {
      type: String,
      required: [true, "Please Enter lost_reason_name"],
      trim: true,
    },
    lost_reason_index: {
      type: Number,
      trim: true,
    },
    lost_reason_status: {
      type: Number,
      default: 1,
      trim: true,  
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("crm_lost_reason", lostreasonSchema);
