const express=require('express');

const { Add_CallLog,getCallLogById,getCallLogByIdAndDate,deleteAllCallLog,
    GetAllUserCallLogById
    ,GetAllUserCallLogByDateWise ,
    GetCallLogByIdAndDateRange,GetUserCallAccordingToTeamLeader,GetAllUserCallLogByIdTeam} = require('../controllers/callLogController');

const router=express.Router();
router.route("/add_call_log").post(Add_CallLog);  
router.route("/get_call_log_by_id/:id").get(getCallLogById); 
router.route("/get_call_log_by_id_date").post(getCallLogByIdAndDate);    
router.route("/delete_all_call_log").delete(deleteAllCallLog);
router.route("/GetAllUserCallLogById").get(GetAllUserCallLogById);

router.route("/GetAllUserCallLogByIdTeam").post(GetAllUserCallLogByIdTeam);

router.route("/GetUserCallAccordingToTeamLeader").post(GetUserCallAccordingToTeamLeader);
router.route("/GetAllUserCallLogByDateWise").post(GetAllUserCallLogByDateWise);
router.route("/GetCallLogByIdAndDateRange").post(GetCallLogByIdAndDateRange);

module.exports=router;     