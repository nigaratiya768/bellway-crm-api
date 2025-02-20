const express=require('express');
const multer = require('multer');
const upload = multer();

const { YearlySaleApi, YearlySaleApiForUser, YearlySaleApiForTeamLeader, 
    LeadSourceOverviewApi,LeadSourceOverviewApiForTeamLeader,
     LeadSourceOverviewApiForUser,GetCalandarData
    ,CompanyDetails,GetCompanyDetails,
    DashboardLeadCount,UnAssignedDashboardLeadCount
    ,DashboardLeadCountOfUser,AgentWishLeadCount,AgentWishLeadCount1,DashboardLeadCountOfUserByTeamLeader,
    RealestateApi ,MagicbricksApi,AcresApi, bwnotification, Businesswtspmessage,
    IncomeGraphOverviewForTeamLeader,IncomeGraphOverviewForUser,IncomeGraphOverview,GetCalandarDataByUser,GetCalandarDataByTeamLeader
} = require('../controllers/genralApiController');
const {LeadProductServiceOverviewApi}  =require('../controllers/allReportController')

const router=express.Router();

router.route("/YearlySaleApi").get(YearlySaleApi);  //for Admin
router.route("/YearlySaleApiForTeamLeader").post(YearlySaleApiForTeamLeader);  //for TeamLeader
router.route("/YearlySaleApiForUser").post(YearlySaleApiForUser);  //for User


router.route("/lead_source_overview_api").get(LeadSourceOverviewApi); //for Admin
router.route("/LeadSourceOverviewApiForTeamLeader").post(LeadSourceOverviewApiForTeamLeader); //for Admin
router.route("/LeadSourceOverviewApiForUser").post(LeadSourceOverviewApiForUser); //for Admin


router.route("/Income_Graph_Overview").get(IncomeGraphOverview);  ////for admin
router.route("/IncomeGraphOverviewForTeamLeader").post(IncomeGraphOverviewForTeamLeader);  ////for tl
router.route("/IncomeGraphOverviewForUser").post(IncomeGraphOverviewForUser);  ////for user

router.route("/get_calander_data").get(GetCalandarData); ////for admin
router.route("/GetCalandarDataByTeamLeader").post(GetCalandarDataByTeamLeader);  ////for teamleader
router.route("/GetCalandarDataByUser").post(GetCalandarDataByUser);   ////for user



router.route("/LeadProductServiceOverviewApi").get(LeadProductServiceOverviewApi);  
router.route("/CompanyDetails").post(CompanyDetails); 
router.route("/GetCompanyDetails").get(GetCompanyDetails);  

router.route("/DashboardLeadCount").get(DashboardLeadCount);  
router.route("/DashboardLeadCountOfUser").post(DashboardLeadCountOfUser);  
router.route("/DashboardLeadCountOfUserByTeamLeader").post(DashboardLeadCountOfUserByTeamLeader);  


router.route("/UnAssignedDashboardLeadCount").get(UnAssignedDashboardLeadCount);
router.route("/AgentWishLeadCount").get(AgentWishLeadCount); 

router.route("/AgentWishLeadCount1").post(AgentWishLeadCount1); 

/////////////// real estate Api
router.route('/RealestateApi').post(upload.none(), RealestateApi);
router.route('/magicbricks').post(upload.none(), MagicbricksApi);
router.route('/99acres').post(upload.none(),AcresApi);
router.route('/bwnotification').get(bwnotification);   
router.route('/Businesswtspmessage').get(Businesswtspmessage);
module.exports=router;     