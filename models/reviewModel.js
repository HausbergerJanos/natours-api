const mongoose = require('mongoose');

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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
