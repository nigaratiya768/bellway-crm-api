const express = require('express');
const { addandupdatetransactionalsms, getallsmsrecord,
    getallwhatsmsrecord, addandupdatewhatappsms } = require('../controllers/transactionalsmsController');
const router = express.Router();
router.route("/addandupdatetransactionalsms").post(addandupdatetransactionalsms);
router.route("/addandupdatewhatappsms").post(addandupdatewhatappsms);
router.route("/getallsmsrecord").post(getallsmsrecord);
router.route("/getallwhatsmsrecord").get(getallwhatsmsrecord);
module.exports = router;