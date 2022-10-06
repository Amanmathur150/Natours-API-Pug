const AppError = require("../utils/appError")

const handleCastErrorDB = (err) =>{
    return new AppError(`Invalid ${err.path} : ${err.value}`,400)
}
const handleDuplicateKeyDB = (err) =>{
    return new AppError(`${err.keyValue.email} is Already exists Please choose another Name`,400)
}
const handleValidationErrorDB = (err) =>{
    const errors = Object.values(err.errors).map(el=>el.message)
    return new AppError(`Invalid data. ${errors.join(". ")}`,400)
}
const handleJsonWebTokenError = () =>{
    return new AppError(`Invalid token! Please login again`,401)
}
const handleTokenExpiredError = () =>{
    return new AppError(`You token has expired! Please login again`,401)
}

const sendErrorDev = (err,req,res)=>{
    if(req.originalUrl.startsWith("/api")){
        // Api Error
        res.status(err.statusCode).json({
            message : err.message ,
            statusCode : err.statusCode ,
            status :  err.status ,
            error : err,
            stack : err.stack
        })
    }else{
        // Rendered Error
        res.status(err.statusCode).render("error",{
            message : err.message ,
        })
    }
   
}

const sendErrorProd = (err,req,res)=>{
    // Operational Trusted Create by us 
   
    
    if(err.isOperational){
        if(req.originalUrl.startsWith("/api")){

            res.status(err.statusCode).json({
                message : err.message ,
                status :  err.status
            })
        }else{
            res.status(err.statusCode).render("error",{
                status :  err.status,
                message : err.message ,
            })
        }
    }else{
        // 1 LOG
        console.log("Production Error",err)
        if(req.originalUrl.startsWith("/api")){

            res.status(500).json({
                status :  err.status,
                message : "Something went wrong!"
            })
        }else{
            res.status(err.statusCode).render("error",{
                status :  err.status,
                message : "Something went wrong!" ,
            })
        }
    
    }
}



module.exports = (err,req,res,next)=>{
    
    err.message = err.message || "something Went wrong Please try again"
     err.statusCode  =  err.statusCode || 500
    err.status = err.status || "error"
    if(process.env.NODE_ENV === "development"){
        sendErrorDev(err,req,res)
    }else  if(process.env.NODE_ENV === "production"){
        let error =err
  
        if(err.name === "CastError") error = handleCastErrorDB(error)
        if(err.code === 11000) error = handleDuplicateKeyDB(error)
        if(err.name === "ValidationError") error = handleValidationErrorDB(error)
        if(err.name === "JsonWebTokenError") error = handleJsonWebTokenError()
        if(err.name === "TokenExpiredError") error = handleTokenExpiredError()
       

        sendErrorProd(error,req,res)
    }
  
}