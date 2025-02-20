const mongoose=require('mongoose');

  const webnotificationSchema= new mongoose.Schema({
       
    user_id:{
       type: mongoose.Schema.ObjectId,
        required:true
    },
    token:{
        type:String, 
        required:true 
    }

  });

  module.exports=mongoose.model("crm_web_notification",webnotificationSchema);