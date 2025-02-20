const mongoose = require("mongoose");

const followupSchema = new mongoose.Schema({  
    lead_id: {
    type: String,
    required: true,
    trim: true,
  },  
  commented_by: { 
    type: String,
    // required: true,
    trim: true,
  },
  followup_status_id: {
    type: String,
    //required: true,
    trim: true,
  },  
  followup_lost_reason_id: {
    type: String,
    trim: true,
  }, 
  followup_won_amount: {
    type: Number,
    trim: true,
  },
  followup_date: {
    type: Date, 
    trim: true,
  },
  followup_desc: {   
    type: String,
    trim: true,
  },
  assign_to_agent: {
    type: String,
    trim: true,
  },
  followup_status: {   
    type: Number,
    default: 1,
    //required: true,
    trim: true,
  },
  for_calender: {
    type: String,
    default: "no",
    trim: true,
  },
  notified: {
    type: String,
    default: 0,
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
  deleted: {  
    type: Date,
  }
});

module.exports = mongoose.model("crm_followup", followupSchema);
