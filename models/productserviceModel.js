const mongoose = require("mongoose");

const productserviceSchema = new mongoose.Schema(
  {
    product_service_name: {
      type: String,
      required: [true, "Please Enter product_service_name"],
      trim: true,
    },
    set_up_fee: {
      type: Number,
      default: 0,
      trim: true,
    },
    payment: {
      type: Number,
      default: 0,
      trim: true,
    },
    recurring: {
      type: Number,
      default: 0,
      trim: true,
    },
    billing_cycle: {
      type: String,
      // required:[true,"Please Enter product_service_name"],
      trim: true,
    },
    product_service_status: {
      type: Number,
      default: 1,
      trim: true,
    },
    product_service_index: {
      type: Number,
      default: 0,
      trim: true,
    },
    product_plan_id: {
      type: String,
      trim: true,
    },
    product_subs_id: {
      type: String,
      trim: true,
    },
    product_subs_name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("crm_product_service", productserviceSchema);
