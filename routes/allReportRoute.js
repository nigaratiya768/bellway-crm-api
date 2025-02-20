const express=require('express');

const { LeadSourceReport,GetProductReportDateWise,
    EmployeesReportDetail,EmployeesReportDetailByFilter } = require('../controllers/allReportController');

const router=express.Router();
  
router.route("/LeadSourceReport").post(LeadSourceReport); 
router.route("/GetProductReportDateWise").post(GetProductReportDateWise); 
router.route("/EmployeesReportDetail").post(EmployeesReportDetail); 
router.route("/EmployeesReportDetailByFilter").post(EmployeesReportDetailByFilter); 
 
module.exports=router;     