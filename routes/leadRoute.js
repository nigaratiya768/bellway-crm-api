const express=require('express');

const { Add_Lead, getAllLead ,getLeadById, deleteAllLead,
      getLeadbyagentidandwithoutstatus,getAllLeadFollowup,getLeadbyagentidandwithstatus,
      BulkLeadUpdate, getAdvanceFillter, LeadTransfer,
      BulkDeleteLead,UpdateLeadByLeadId,
      leadattechmenthistory,deleteLeadAttechmentHistory
      ,getAllNewLead,getAllNewLeadBYAgentId,getAllUnassignLead
    ,getLeadbyTeamLeaderidandwithstatus,getLeadbyTeamLeaderidandwithoutstatus,getLeadbyScheduleEventid} = require('../controllers/leadController');  


const router=express.Router();
router.route("/add_lead").post(Add_Lead);
router.route("/get_all_lead").get(getAllLead);  
router.route("/getAllUnassignLead").get(getAllUnassignLead);
router.route("/getAllNewLead").get(getAllNewLead); 

router.route("/getAllNewLeadBYAgentId").post(getAllNewLeadBYAgentId); ////////Get All New Lead For Agent (By Agent Id)

router.route("/getAdvanceFillter").post(getAdvanceFillter); 

router.route("/get_lead_by_id/:id").get(getLeadById); 
router.route("/delete_all_lead").delete(deleteAllLead);
router.route("/get_Leadby_agentid_status").post(getLeadbyagentidandwithoutstatus); //for followuppage
//  with loss and won status
router.route("/get_Leadby_agentid_with_status").post(getLeadbyagentidandwithstatus);  // for all lead Page
router.route("/getLeadbyTeamLeaderidandwithstatus").post(getLeadbyTeamLeaderidandwithstatus);  // for all lead Page By TL Id
router.route("/getLeadbyTeamLeaderidandwithoutstatus").post(getLeadbyTeamLeaderidandwithoutstatus);  // for all lead Page By TL Id Without Win ,Loss
router.route("/get_All_Lead_Followup").get(getAllLeadFollowup);  // for followuppage
router.route("/BulkLeadUpdate").put(BulkLeadUpdate);
router.route("/LeadTransfer").put(LeadTransfer);
router.route("/BulkDeleteLead").delete(BulkDeleteLead);
router.route("/UpdateLeadByLeadId/:id").put(UpdateLeadByLeadId);
router.route("/leadattechmenthistory/:id").get(leadattechmenthistory); 
router.route("/deleteLeadAttechmentHistory/:id").delete(deleteLeadAttechmentHistory);

router.route("/getLeadbyScheduleEventid").post(getLeadbyScheduleEventid);  ///////get All ScheduleEvent Lead 

 
// router.route("/BulkLeadUplodeExcel",upload.single('file')).post(BulkLeadUplodeExcel); 
      
module.exports=router;            