const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const APIfilter = require('../utils/APIfilters');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handleFactoy');

exports.monthlyPlan = catchAsync(async (req, res, next) => {
  let year = req.params.year;
  const tours = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $lte: new Date(`${year}-12-31`),
          $gte: new Date(`${year}-1-1`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tours: { $push: { name: '$name', startDates: '$startDates' } },
        numTour: { $sum: 1 },
      },
    },
    { $addFields: { month: '$_id' } },
    { $sort: { numTour: -1 } },
    { $project: { _id: 0 } },
  ]);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});
exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,duration,summary,difficulty,ratingsAverage';
  req.query.sort = 'price,-ratingsAverage';
  next();
};

exports.getAllTour = getAll(Tour)
// exports.getAllTour = catchAsync(async (req, res, next) => {
//   const query = new APIfilter(Tour.find(), req.query)
//     .filter()
//     .fieldsLimit()
//     .limit()
//     .pagination()
//     .sort();
//   const tours = await query.query;
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: tours,
//   });
// });

exports.getTour = getOne(Tour,"reviews")
// exports.getTour = catchAsync(async (req, res,next) => {
//   const { id } = req.params;

//   const tour = await Tour.findById(id).populate("reviews");

//   if(!tour){
//     return next(new AppError("No tour found with that Id" , 404))
//   }
//   res.status(200).json({
//     status: 'success',
//     data: tour,
//   });
// }
// );

exports.deleteTour = deleteOne(Tour)
exports.updateTour = updateOne(Tour)
// exports.deleteTour = catchAsync(async (req, res,next) => {
//   const { id } = req.params;
//   const tour= await Tour.findByIdAndDelete(id);
//   if(!tour){
//     return next(new AppError("No tour found with that Id" , 404))
//   }
//   res.status(200).json({
//     status: 'success',
//     message: 'Tour has been deleted Sucessfully',
//   });
// });
// exports.updateTour = catchAsync(async (req, res,next) => {
//   const { id } = req.params;


//   const tour = await Tour.findByIdAndUpdate(id, req.body, {
//     runValidators: true,
//     new: true,
//   });

//   if(!tour){
//     return next(new AppError("No tour found with that Id" , 404))
//   }
//   res.status(200).json({
//     status: 'success',
//     data: tour,
//   });
// });

exports.createTour = createOne(Tour)
// exports.createTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.create(req.body);
//   res.status(200).json({
//     status: 'success',
//     data: tour,
//   });
// });
exports.getToursWithin = catchAsync(async (req, res, next) => {
  console.log("req.params",req.params)
  let {distance,unit} = req.params
  let [lat,lng] = req.params.latlng.split(",")

  let radius = unit ==="mi" ? distance /3963.2 : distance / 6378.1
  if(!lat || !lng){
    return next(new AppError("Please provide lang and lati in the lat,lan",400))
  }
  const tour = await Tour.find({startLocation : {$geoWithin : {$centerSphere : [[lng,lat],radius]}}})
  res.status(200).json({
    status: 'success',
    results : tour.length,
    data: tour,
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  console.log("req.params",req.params)
  let {distance,unit} = req.params
  let [lat,lng] = req.params.latlng.split(",")

  let distanceMultiplier = unit ==="mi" ? 0.000621371 : 0.001
  if(!lat || !lng){
    return next(new AppError("Please provide lang and lati in the lat,lan",400))
  }
  const tour = await Tour.aggregate([{$geoNear : {
    near :{
      type : "Point",
      coordinates :[Number(lng),Number(lat)]
    },
    distanceField : "distance",
    distanceMultiplier : distanceMultiplier
  }}])
  res.status(200).json({
    status: 'success',
    results : tour.length,
    data: tour,
  });
});
