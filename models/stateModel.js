const mongoose=require('mongoose');

  const countrySchema= new mongoose.Schema({
       
    name:{
        type:String,
        required:true
    },
    country_short_name:{
        type:String, 
        required:true 
    }

  });

  module.exports=mongoose.model("crm_state",countrySchema);