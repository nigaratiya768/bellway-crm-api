const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  group_id: {
    type: Number,
    default: 1,
    trim: true,
  },
  full_name: {
    type: String,
   // required: true,
    trim: true,
  },
  email_id: {
    type: String,
    // required: true,
    trim: true,
  },
  contact_no: {
    type: String,
    // required: true,
    unique: true,
    trim: true,
  },
  alternative_no: { 
    // type: Number,
    type: String,
    trim: true,
  },
  company_name: {
    type: String,
    trim: true,
  },
  position: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  service: {
    // type: String,
    type: mongoose.Schema.ObjectId,
    //required: true,
    trim: true,
  },
  lead_cost: {
    type: String,
    trim: true,
  },
  followup_won_amount: {
    type: Number,
    default: 0,
    trim: true,
  },
  followup_lost_reason_id: {
    type: String,
    trim: true,
  },
  add_to_calender: {
    type: String,
    trim: true,
    default: 'no',
  },
  massage_of_calander: {
    type: String,
    trim: true,

  },
  lead_source: {
    // type: String,
    type: mongoose.Schema.ObjectId,
    //required:true,
    trim: true,
  },
  full_address: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  }, 
  pincode: {
    type: Number,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    //type: String,
    type: mongoose.Schema.ObjectId,
    trim: true,
  },
  logistics_status: {
    type: Number,
    trim: true,
  },
  assign_to_agent: {
    //type: String,
    type: mongoose.Schema.ObjectId,
    // required:true,
    trim: true,
  },
  property_stage: {
    type: String,
    trim: true,
  },
  assistant_name: {
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
  deleted: {
    type: Date,
  },
  client_id: {
    type: String,
    trim: true,
  },
  followup_date: {
    type: Date,
  },
  forword_agent_id: {
    type: String,
    trim: true,
  },
  lead_date: {
    type: String,
    trim: true,
  },
  apartment_names: {
    type: String,
    trim: true,
  },
  service_type: {
    type: String,
    trim: true,
  },
  category_type: {
    type: String,
    trim: true,
  },
  max_area: {
    type: String,
    trim: true,
  },
  min_area: {
    type: String,
    trim: true,
  },
  min_price: {
    type: String,
    trim: true,
  },
  max_price: {
    type: String,
    trim: true,
  },
  flat_id: {
    type: String,
    trim: true, 
  },
  type: {
    type: String,
  },
});

module.exports = mongoose.model("crm_lead", leadSchema);
