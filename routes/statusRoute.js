const express=require('express');
const { addLeadStatus, deleteLeadStatus, getAllLeadStatus, updateLeadStatus } = require('../controllers/statusController');



const  router=express.Router();

router.route("/add_lead_status").post(addLeadStatus);   
router.route("/delete_lead_status/:id").delete(deleteLeadStatus);
router.route("/all_lead_status").get(getAllLeadStatus);
router.route("/update_lead_status/:id").put(updateLeadStatus);
 

module.exports=router;