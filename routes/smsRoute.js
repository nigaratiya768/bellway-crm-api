const express=require('express');
const { addSmsReport, getAllSmsReport } = require('../controllers/smsreportController');



const  router=express.Router();

router.route("/addSmsReport").post(addSmsReport);   
router.route("/getAllSmsReport").get(getAllSmsReport);

module.exports=router;