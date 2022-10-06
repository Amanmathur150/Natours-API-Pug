const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: [40, 'Tour Name Must Have maximum length 40 Character'],
      mixLength: [10, 'Tour Name Must Have minimum length 40 Character'],
      unique: [true, 'Tour Name Already exists'],
      trim: true,
      required: [true, 'Tour Must have name'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour Must have Duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour Must have max Group Size'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'A tour Difficulty only be easy,medium,difficult',
      },
      required: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must have minimum 1 '],
      max: [5, 'rating must have maximum 5 '],
      set : (val)=> Math.round(val *10)/10
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this will not working on update
          return val < this.price;
        },
        message: `Price Discount ({VALUE}) should be less then price`,
      },
    },
    // "durationWeeks":Number,
    summary: {
      type: String,
      required: [true, 'a tour must have summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    startDates: {
      type: [Date],
    },
    createAt: {
      type: Date,
      default: Date.now(),
      select: false, //This Field Never shows in result if it is false
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
          message: 'type should be Point Only',
        },
      },
      description: String,
      coordinates: Array,
      address: String,
    },

    locations: [
      {
        description: String,
        type: {
          type: String,
          default: 'Point',
          enum: {
            values: ['Point'],
            message: 'type should be Point Only',
          },
        },
        coordinates: Array,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
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

tourSchema.index({startLocation : "2dsphere"})

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
})


tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: 'name photo email' });
  next();
});

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: {
//       secretTour: { $ne: true },
//     },
//   });
//   next();
// });



let Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
