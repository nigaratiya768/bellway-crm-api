 const Status=require('../models/statusModel');
 const ErrorHander = require("../utils/errorhander");
 const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// create status 
exports.addLeadStatus=catchAsyncErrors(async (req,res,next)=>{
            const leadstatus=await Status.create(req.body);
            res.status(201).json({
            success: true,
            leadstatus,
          });  
})

// Delete lead status
exports.deleteLeadStatus=catchAsyncErrors(async (req,res,next)=>{
    const leadstatus=await Status.findById(req.params.id);
    if(!leadstatus){   
      return next(new ErrorHander("Lead status is not found",404));
    }     
    await leadstatus.deleteOne();           
      res.status(201).json({
      success:true, 
      message:"Deleated Successfully",
      leadstatus,
    }) 
 }) 
// get All Lead Status 
exports.getAllLeadStatus=catchAsyncErrors(async(req,res,next)=>{
          const leadstatus=await Status.find().sort({ status_name: 1 });
          res.status(200).json({
            success:true,
            leadstatus
          })
 })



////  
exports.updateLeadStatus=catchAsyncErrors(async (req,res,next)=>{
       const leadstatus=await Status.findById(req.params.id);  
  if(!leadstatus){
        return next(new ErrorHander("Status is not found",404));
      }
 const leadstatus1=await Status.findByIdAndUpdate(req.params.id,req.body,{
         new:true,
         runValidators:true,
         useFindAndModify:false,
      })
  res.status(200).json({
         success:true,
         leadstatus1
      })
})