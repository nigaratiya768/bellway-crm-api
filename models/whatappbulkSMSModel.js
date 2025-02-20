const mongoose = require("mongoose");

const whatappsmsSchema = new mongoose.Schema(
  {
    endpointurl: {
      type: String,
      trim: true,
    },
    sender: {
      type: String,
      trim: true,
    },
    user: {
      type: String,
      trim: true,
    },
    pass: {
      type: String,
      trim: true,
    },
    priority:{
        type: String,
        trim: true,
    },
    stype:{
        type: String,
        trim: true,
    },
    htype:{
        type: String,
        trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("whatsappsms", whatappsmsSchema);
