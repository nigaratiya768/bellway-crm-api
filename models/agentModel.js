const mongoose = require("mongoose");
const validater = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const JWT_SECRET='griguirghkjfndfkmgnjfhgjfh';
// const JWT_EXPIRE='5d';
const crypto = require("crypto");

const agentSchema = new mongoose.Schema(
  {
    agent_name: {
      type: String,
      required: [true, "Please Enter Agent Name"],
      trim: true,
    },
    agent_email: {
      type: String,
      required: [true, "Please Enter agent_email"],
      unique: true,
      // validate:[validator.isEmail,"plz enter a valid email"]
    },
    agent_mobile: {
      type: String,
      //  required:[true,"Please Enter Agent Mobile"],
      unique: true,
      // validate:[validator.isMobilePhone,"plz enter a valid Mobile"]
    },
    agent_password: {
      type: String,
      unique: true,
      required: [true, "Please Enter Your password"],
      minLength: [6, "minimum 6 charactor take of pass"],
      select: false,
    },

    role: {
      type: String,
      default: "user",
    },
    agent_roll: {
      type: String,
      required: true,
      default: "sales",
    },
    profile_image: {
      type: String,
    },
    pimg: {
      type: String,
    },
    assigntl: {
      type: mongoose.Schema.ObjectId,
    },
    agent_index: {
      type: Number,
    },
    agent_status: {
      type: Number,
      default: 1,
    },
    client_access: {
      type: String,
      default: "no",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// convert pass in bcrypt hash then save
agentSchema.pre("save", async function (next) {
  if (!this.isModified("agent_password")) {
    next();
  }
  this.agent_password = await bcrypt.hash(this.agent_password, 10);
});

// JWT Token

agentSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// agentSchema.methods.getJWTToken = function () {
//   console.log("i am going to gen token");
//     return jwt.sign({ id: this._id },"jhfgdfdssedrftghjkl", {
//      expiresIn: "5d",
//     });
// };


// compare password

agentSchema.methods.comparePassword = async function (enterpassword) {
  return await bcrypt.compare(enterpassword, this.agent_password);
};

// genrating pass  reset token

agentSchema.methods.getResetPasswordToken = function () {
  // genrate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and add to userschema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("crm_agent", agentSchema);
