const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const { updateOne, createOne, deleteOne, getOne, getAll } = require("./handleFactoy");

// exports.getAllReview = catchAsync(async (req,res,next)=>{
    //     let filter = {}
    //     if(req.params.tourId) filter = {tour : req.params.tourId}
    //         const reviews = await Review.find(filter)
    
//         res.status(200).json({
    //             status : "success",
    //             data :{
//                 reviews
//             }
//         })
// })

exports.setUserIdAndTourId = (req,res,next) =>{
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user._id
    next()
}

exports.getReview = getOne(Review)


exports.getAllReview = getAll(Review)
exports.createReview = createOne(Review)
exports.updateReview = updateOne(Review)
exports.deleteReview = deleteOne(Review)


// exports.createReview = catchAsync(async (req,res,next)=>{
//         const review = await Review.create(req.body)

//         res.status(201).json({
//             status : "success",
//             data :{
//                 review
//             }
//         })
// })