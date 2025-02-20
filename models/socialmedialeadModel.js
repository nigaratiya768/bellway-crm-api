const mongoose = require("mongoose");

const socialmedialeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    mobile: {
      type: Number,
      trim: true,
    },
    service: {
      type: String,
      trim: true,
    },
    source:{
      type: String,
      trim: true, 
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("crm_socialmedialead", socialmedialeadSchema);
