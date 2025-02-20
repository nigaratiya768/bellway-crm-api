const mongoose = require("mongoose");

const transactionalsmsSchema = new mongoose.Schema(
  {
    endpointurl: {
      type: String,
      trim: true,
    },
    key: {
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
    type: {
      type: String,
      trim: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("transactionalSms", transactionalsmsSchema);
