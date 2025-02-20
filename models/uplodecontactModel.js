const mongoose = require("mongoose");

const uploadcontactSchema = new mongoose.Schema(
  {
    document_name: {
      type: String,
      required: true,
      trim: true,
    },
    document_second_name: {
        type: String,
        required: true,
        trim: true,
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("uploadcontact", uploadcontactSchema);
