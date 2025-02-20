
const Lead_Source=require('../models/leadsourceModel');

const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const ErrorHander = require("../utils/errorhander");

/// creat LeadSource
exports.Add_LeadSource = catchAsyncErrors(async (req, res, next) => {
     const leadSource = await Lead_Source.create(req.body);
     res.status(201).json({
      success: true,
      message:"leadSource  Has Been Added Successfully",
      leadSource,
    });   
    });

  /// Delete LeadSource

  exports.deleteLeadSource=catchAsyncErrors(async(req,res,next)=>{
       
     const leadSource=await Lead_Source.findById(req.params.id);

     if(!leadSource){
        return next(new ErrorHander("leadSource is not found"));
     }
    
      await leadSource.deleteOne();

      res.status(200).json({
        success:true,
        message:"leadSource  Has Been Delete Successfully",
        leadSource
      })



  });

  //// get All Lead Source 

   exports.getAllLeadSource=catchAsyncErrors(async (req,res,next)=>{
          const leadSource= await Lead_Source.find();
          res.status(200).json({
            success:true,  
            leadSource   
          })
   });

   ///// update lead Source   
   exports.updateLeadSource=catchAsyncErrors(async (req,res,next)=>{
         const leadSource1=await Lead_Source.findById(req.params.id);
         if(!leadSource1){
            return next(new ErrorHander("Lead Source Not Found"))
         }
         const leadSource=await Lead_Source.findByIdAndUpdate(req.params.id,req.body,{   
              new:true,    
              runValidators:true,    
              useFindAndModify:false,
         })
          res.status(200).json({     
            success: true, 
            message:'Lead Update Successfully',
            leadSource,  
          });

   })

   ////////// 





