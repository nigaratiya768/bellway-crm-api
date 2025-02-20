const express=require('express');

const { sendnotificationinweb } =require('../controllers/sentNotificationWebController');

const router=express.Router();

router.route('/sendnotificationinweb').post(sendnotificationinweb);
  
module.exports=router;   