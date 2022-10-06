const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please Write review'],
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must have tour'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
      select: false, //This Field Never shows in result if it is false
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

reviewSchema.index({user : 1, tour :1} , {
  unique :true
})

reviewSchema.pre(/^find/, function(next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

reviewSchema.statics.calculateAvgRating =async function(tourId){
  const status =  await this.aggregate([{
    $match : {tour : tourId} }, 
  {$group : {
    _id : "$tour",
    nRating : {$sum : 1} , 
    avgRating : {$avg : "$rating"}
  }}  
  ])


    await Tour.findByIdAndUpdate( tourId,{
      ratingsAverage  : status.length ? status[0].avgRating : 4.5 , 
      ratingsQuantity  : status.length ? status[0].nRating : 0 , 
      
    })
 
}

reviewSchema.post("save" , function () {

  this.constructor.calculateAvgRating(this.tour)
})


reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne().clone()
  next();
});
reviewSchema.post(/^findOneAnd/, async function() {
  
  await this.r.constructor.calculateAvgRating(this.r.tour)
});

let Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
