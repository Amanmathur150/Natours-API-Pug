const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const crypto = require("crypto")



const signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRES_IN})
}

const signTokenSendResponse = (user,req,res)=>{
    const token =signToken(user._id)
    res.cookie("jwt" ,token,{
        expire : new Date() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60*60*1000,
        httpOnly : true,
        secure : req.secure || req.headers["x-forwarded-proto"] === "https"
    })
    user.password = undefined
    res.status(200).json({
        status: 'success',
        token , 
        data: {
            user : user
        },
      });
}

exports.signup = catchAsync( async(req,res,next) =>{

    const {name, email,password , confirmPassword } = req.body
    const newUser =  await User.create({
        name,
        email,
        password,
        confirmPassword
    })
    const redirectUrl = `${req.protocol}://${req.get("host")}/me`
    await new Email(newUser,redirectUrl).sendWelcome()

    signTokenSendResponse(newUser,req,res)

})


exports.login = catchAsync( async(req,res,next) =>{
    const {email,password } = req.body
    if(!email || !password){
        return next(new AppError("Please provide email and password" , 400))
    }

    const user = await User.findOne({email}).select("+password")
    if(!user || !(await user.checkPassword(password,user.password))){
        return next(new AppError("Email and Password is not matched!" , 401))
    }

      signTokenSendResponse(user,req,res)

})
exports.protect = catchAsync( async(req,res,next) =>{
    let token , decoded;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }else if(req.cookies.jwt){
        token = req.cookies.jwt
    }
    
    if(!token){
        return next(new AppError("You are not logged in !Please login to get access",401))
    }
    
    decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)

   let user = await User.findById(decoded.id)

   if(!user){
    return next(new AppError("The user belonging to this token does not exist.",401))
   }
   res.locals.user = user
   req.user = user
   next()
})
exports.loggedIn = async(req,res,next) =>{
    try {
        let token , decoded;
      
     if(req.cookies.jwt){
        token = req.cookies.jwt
    }
   
    if(!token){
        return next()
    }
    
    decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)

   let user = await User.findById(decoded.id)
    
   if(!user){
    return next()
   }

   res.locals.user = user

   next() 
    } catch (error) {
    
        return next()
    }
  
}
exports.loggedOut = async(req,res,next) =>{
    try {
     
        res.cookie("jwt","logged out sucessfully",{
            expires : new Date(Date.now() + 10 * 1000)  ,
            httpOnly : true
        })
       
  res.status(200).json({
    status:"success",
    message:"logout"
  })
}catch(error){
    console.log(error)
}
}

exports.restrictTo = (...roles) =>catchAsync( async(req,res,next) =>{
    if(!roles.includes(req.user.role)){
        return next(new AppError("You do not have permission to perform this action!",403))
    }
   next()
})
exports.forgotPassword = catchAsync( async(req,res,next) =>{
    let {email} = req.body
    let user = await User.findOne({email})

    if (!user){
        return next(new AppError("There is no user with this email address"))
    }

    let resetToken =  user.createPasswordResetToken()
    user.save({validateBeforeSave:false})
    try {
        
            const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}}`
          
            await new Email(user,resetURL).sendPasswordReset()

        
    } catch (error) {
       user.passwordResetToken  =undefined
        user.passwordResetExpires=undefined
        user.save({validateBeforeSave:false})
       return next(new AppError("There was an error sending the email. Please Try again later",500))
    }

    res.status(200).json({
        status: "success",
        message : "Token Sent To Email"
    })
})
exports.resetPassword = catchAsync( async(req,res,next) =>{
    const passwordHash = crypto.createHash("sha256").update(req.params.token).digest("hex")
    let user =  await User.findOne({passwordResetToken : passwordHash , passwordResetExpires : {
        $gt : Date.now()
    }})

    if(!user){
        return next(new AppError("Invalid Token or Token Expires",400))
    }


    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.passwordChangeAt = Date.now()
    await user.save()

    res.status(200).json({
        status : "success",
        message : `Your password has been change successfully please login!`
    })

})
exports.updatePassword = catchAsync( async(req,res,next) =>{
  
   let user = await User.findById(req.user._id).select("+password")
  
   if(!user){
    return next(new AppError("User Not Found",400))
   }


   const checkPassword = user.checkPassword(req.body.password,user.password)

   if(!checkPassword){
    return next(new  AppError("Your Current Password is wrong",401))
   }
 
    user.password = req.body.newPassword
    user.confirmPassword = req.body.newConfirmPassword
    user.passwordChangeAt = Date.now()
    await user.save()
  

   res.status(200).json({
    status : "success",
    message : `Your password has been change successfully!`
})
})