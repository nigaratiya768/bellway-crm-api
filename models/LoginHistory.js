// models/LoginHistory.js

const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: { type: String,  },
  ipAddress: { type: String, },
  browser: { type: String,  },
  system: { type: String,  },
  location: { type: String, },
  loginTime: { type: Date, default: Date.now },
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

module.exports = LoginHistory;
