const mongoose = require("mongoose");

const whatappSchema = new mongoose.Schema(
  {
    fromname: {
      type: String,
      trim: true,
    },
    fromphone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("whatmessage", whatappSchema);
