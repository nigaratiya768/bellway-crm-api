const mongoose = require("mongoose");

const uploadcontactDataSchema = new mongoose.Schema(
  {
    uplodecontactid: {
      type: mongoose.Schema.ObjectId,
      required:true,
      trim: true,
    },
    clientname: {
        type: String,
        trim: true,
      },
      clientMobile: {
        type: String,
        trim: true,
      },
   
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("uploadcontactdata", uploadcontactDataSchema);
