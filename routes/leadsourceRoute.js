const express=require('express');
const { Add_LeadSource,deleteLeadSource,getAllLeadSource,updateLeadSource } = require('../controllers/leadsourceController');


const router=express.Router();


  router.route("/add_lead_source").post(Add_LeadSource);   
  router.route("/delete_lead_source/:id").delete(deleteLeadSource);
  router.route("/all_lead_source").get(getAllLeadSource);
  router.route("/update_lead_source/:id").put(updateLeadSource);

  
     
      


  module.exports=router;   