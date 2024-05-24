const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator')
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        ' A tour name must have less than equal to 40 characters',
      ],
      minlength: [
        10,
        ' A tour name must have less than equal to 10 characters',
      ],
      // validate: [validator.isAlpha,'Tour Name must contain only characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max_group_size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a Difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'Difficulty can be either easy , medium , difficulty',
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than equal to 1'],
      max: [5, 'Rating must be less than equal to 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    // CUSTOM VALIDATOR
    priceDiscount:{
      type: Number,
      validate:{
        validator: function(val){
          // THIS ONLY POINTS TO CURRENT DOC ON NEW DOCUMENT CREATION
          return val<this.price;
        },
        message: 'Discount Price ({VALUE}) should be lower than regular price'
        }
      },

      summary:{
      type: String,
      trim: true,
      required: [true, 'A tour must have a Description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// DOCUMENT MIDDLEWARE
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.pre('save',function(next){
//   console.log('will Save Documents');
//   next();
// })
// tourSchema.post('save', function(doc,next){
//   console.log(doc);
//   next();
// // })
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds`);
  next();
});
//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTOur: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
