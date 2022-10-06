
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");




exports.getOverview = catchAsync( async(req,res,next)=>{
    
    res.render("overview",{
        title : "overview",
        tours : await Tour.find()
    })
})

exports.getTours = catchAsync(async(req,res,next)=>{
    const tour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews" , select : "review user rating"})
    if(!tour){
        return next(new AppError("This is no Tour For that name"))
    }
    res.render("tour",{
        title : `${tour.name} Tour`,
        tour 
    })
})

exports.getLoginForm = catchAsync(async(req,res,next)=>{
    res.render("login",{
        title : "log into you account",
        tour : await Tour.findOne({slug:req.params.slug}).populate({path:"reviews" , select : "review user rating"})
    })
})
exports.getAccount = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.user._id)
    if(!user){
        return next(new AppError("Your are not logged in please login"))
    }
    res.render("account",{
        title : "My account",
        user :user
    })
})

