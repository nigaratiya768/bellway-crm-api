class ErrorHander extends Error{
    // constructor(massage,statusCode){
    //     super(massage);
        constructor(message,statusCode){
            super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);  
    } 
}

module.exports=ErrorHander;