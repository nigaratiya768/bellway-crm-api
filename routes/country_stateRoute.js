const express=require('express');
const { getAllCountry, getAllState,getStateByCountry } = require('../controllers/country_state_city');


const router=express.Router();
router.route("/get_all_country").get(getAllCountry);
router.route("/get_all_state").get(getAllState); 
router.route("/get_state_by_country").post(getStateByCountry); 

module.exports=router;   