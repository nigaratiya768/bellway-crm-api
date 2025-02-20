const express=require('express');

const { createAgent,getAllAgent,getAgentDetails,deleteAgent,
     loginAgent, updateClientAccess,EditAgentDetails,
     getAllTeamLeader,getAllAgentByTeamLeader,getAllAgentofATeamByAgent } = require('../controllers/agentController');

const router=express.Router();
  
router.route("/add_agent").post(createAgent); 


router.route("/get_all_agent").get(getAllAgent); ///  For get All Agent According to Admin
router.route("/getAllAgentByTeamLeader").post(getAllAgentByTeamLeader);  /// for get Agent According to TL
router.route("/getAllAgentofATeamByAgent").post(getAllAgentofATeamByAgent);  ////// Get All Agent Of A Team 
router.route("/getAllTeamLeader").get(getAllTeamLeader); 
router.route("/get_agent_details/:id").get(getAgentDetails);

router.route("/agent_delete/:id").delete(deleteAgent);
router.route("/agent_login").post(loginAgent);
router.route("/update_agent_access/:id").put(updateClientAccess);
router.route("/EditAgentDetails/:id").put(EditAgentDetails)
   
module.exports=router;      