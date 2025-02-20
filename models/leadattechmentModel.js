const mongoose = require("mongoose");
const leadAttechmentSchema = new mongoose.Schema({
  leadattechment: {
    type: String,
    trim: true,
  },
  attechment_name: {
    type: String,
    trim: true,
  },
  lead_id: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  created: {  
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("crm_lead_attachment", leadAttechmentSchema);
