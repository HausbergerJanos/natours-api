/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      required: [true, 'A review most have a rating!'],
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be belove 5.0'],
    },
    createdAt: { type: Date, default: Date.now() },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user!'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour!'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review document
  // Review.calculateAverageRatings(this.tour); - Not possible, bc Review here not exists.
  // We can not put this method after Review creation, bc reviewSchema will not containst
  // this middleware
  this.constructor.calculateAverageRatings(this.tour);
});

// findByIdAndUpdate (findOneAnd)
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this points to current query
  // we can save something in pre hook, which will be available in post hook
  this.document = await this.model.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  // this points to current query
  // this.document - awailable here
  await doc.constructor.calculateAverageRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
