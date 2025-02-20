
 const Product_Service=require('../models/productserviceModel');

 const catchAsyncErrors=require('../middleware/catchAsyncErrors');
 const ErrorHander = require("../utils/errorhander");
 const sendToken = require("../utils/jwtToken");


 /// creat Prroduct & Service
     exports.Add_Product_Service = catchAsyncErrors(async (req, res, next) => {
      
    
      const product_service = await Product_Service.create(req.body);
    
      res.status(201).json({
        success: true,
        message:"Product & Service  Has Been Added Successfully",
        product_service,
      });   
    
     
    });

    //// Delete Product & Service

    exports.Delete_Product_service=catchAsyncErrors(async (req,res,next)=>{
              const product_service=await  Product_Service.findById(req.params.id);

              if(!product_service){
               return next(new ErrorHander('Product Service Not Found',404));
              }
              await product_service.deleteOne();
              res.status(200).json({
               success:true,
               message:"Product & Service  Has Been Delete Successfully",
               product_service,
              })
  }); 

   //// Get All Product & Service

   exports.getAllProductService=catchAsyncErrors(async(req,res,next)=>{
           const product_service=await Product_Service.find();
           res.status(201).json({
            success: true,
            product_service, 
           });      
   });

   /// edit product & service

   exports.updateProductService=catchAsyncErrors(async(req,res,next)=>{
      let product_service=await Product_Service.findById(req.params.id);
          if(!product_service){
            return next(new ErrorHander(" product_service is not Found ",404));
          }
          product_service=await Product_Service.findByIdAndUpdate(req.params.id,req.body,{
                 new:true,
                 runValidators:true,
                 useFindAndModify:false,
          });

          res.status(200).json({    
            success: true,
            message:'Product Update Successfully',
            product_service,  
          });


   })
      