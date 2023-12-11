const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tours/sdsm4sd4/reviews
// POST /reviews
router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );

router
  .route('/:id')
  .delete(authController.protect, reviewController.deleteReview);

module.exports = router;
