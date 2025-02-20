const express=require('express');
const { Add_Followup_Lead, getFollowupById } = require('../controllers/followupController');


const router=express.Router();
router.route("/add_followup_lead").post(Add_Followup_Lead);
router.route("/all_followup_lead_by_id/:id").get(getFollowupById);

module.exports=router;     