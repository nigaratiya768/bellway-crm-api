const express=require('express');
const { addLostReason, deleteLostReason, getAllLostReason, updateLostReason } = require('../controllers/lostreasonController');



const  router=express.Router();

router.route("/add_lead_reason").post(addLostReason);   
router.route("/delete_lead_reason/:id").delete(deleteLostReason);
router.route("/all_lead_reason").get(getAllLostReason);
router.route("/update_lead_reason/:id").put(updateLostReason);
  

module.exports=router;