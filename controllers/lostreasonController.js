const LostReason=require('../models/lostreason'); 
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");



// create lost reason

exports.addLostReason=catchAsyncErrors(async (req,res,next)=>{

          const lostreason=await LostReason.create(req.body);

          res.status(201).json({
           success: true,
           lostreason,
         });  
})

// Delete lost reason

exports.deleteLostReason=catchAsyncErrors(async (req,res,next)=>{

   const lostreason=await LostReason.findById(req.params.id);

   if(!lostreason){
     return next(new ErrorHander("lost reason is not found",404));
   }

   await lostreason.deleteOne();   

   res.status(201).json({
     success:true,
     message:"Deleated Successfully",
     lostreason,
   }) 
   
}) 

// get All lost reason
exports.getAllLostReason=catchAsyncErrors(async(req,res,next)=>{
         const lostreason=await LostReason.find();

         res.status(200).json({
           success:true,
           lostreason
         })
})

////  update Lost Reason 

exports.updateLostReason=catchAsyncErrors(async (req,res,next)=>{
     
     const lostreason=await LostReason.findById(req.params.id);  

     if(!lostreason){
       return next(new ErrorHander("Status is not found",404));
     }

    const  lostreason1=await LostReason.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
     })

     res.status(200).json({
        success:true,
        lostreason1
     })
})