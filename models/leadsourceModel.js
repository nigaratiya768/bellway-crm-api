const mongoose=require('mongoose');

  const leadsourceSchema= new mongoose.Schema({
       
    lead_source_name:{
        type:String,
        required:[true,"Please Enter lead_source_name"],
        trim:true
    },
    lead_source_index:{
        type:Number,
        trim:true 
    },
    lead_source_status:{  
        type:Number,
        default:1,  
        trim:true 
    } 
    

  },
  {
    timestamps: true
}
);
  
   
  module.exports=mongoose.model("crm_lead_source",leadsourceSchema);