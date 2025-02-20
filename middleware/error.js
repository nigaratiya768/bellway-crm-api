const ErrorHander=require('../utils/errorhander');
const mongoose=require('mongoose');
module.exports=async(err,req,res,next)=>{

    if (res.headersSent) {
        return next(err);
    } 

    err.statusCode= err.statusCode || 500;
    err.message=err.message || "Internal Server Error";


 // wrong mongodb id error 
 if(err.name === "CastError"){
    const message=`Resource not Found. Invalid : ${err.path}`;
    err= new ErrorHander(message,400);
 }
   
    // if(err.message=='Client must be connected before running operations'){
    //     const mongodbUrl = req?.headers['mongodb-url']?.trim();
    //      if (mongodbUrl) {
    //         await mongoose.connect(mongodbUrl, {
    //             useNewUrlParser: true,
    //             useUnifiedTopology: true,
    //         });   
    //          next();
    //     } else {
    //         return res.status(400).send('No MongoDB URL provided in request headers');
    //     }
    // }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
         })

}