const mongoose=require('mongoose');

  const notificationsaveSchema= new mongoose.Schema({
       
    user_id:{
        type:String,
        required:true
    },
    title:{
        type:String, 
        required:true 
    },
    body:{
        type:String, 
        required:true 
    },
    datetime:{
        type: Date,
        required:true 
    }

  });

  module.exports=mongoose.model("crm_notificationwebsave",notificationsaveSchema);