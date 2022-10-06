const mongoose = require('mongoose');
const Tour = require('./tourModel');

const bookingSchema = mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref : "Tour",
      required: [true, 'Booking must be belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must be belong to a tour'],
    },
    price: {
      type: Number,
      required: [true, 'Booking must have price'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
      select: false, //This Field Never shows in result if it is false
    },
    paid : {
        type : Boolean,
        default :true
    } , 
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

bookingSchema.pre(/^find/ , function(){
    this.populate("user").populate({
        path : "tour",
        select : "name"
    })
})






let Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
