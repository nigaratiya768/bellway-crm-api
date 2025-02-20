const express=require('express');
const { addAllSocialMediaLead ,getAllSocialMediaLead , AllSocialMediaLead} = require('../controllers/facebookController');



const  router=express.Router();

router.route("/webhook").post(addAllSocialMediaLead);   
router.route("/webhook").get(AllSocialMediaLead); 
router.route("/getAllSocialMediaLead").get(getAllSocialMediaLead);   

module.exports=router;