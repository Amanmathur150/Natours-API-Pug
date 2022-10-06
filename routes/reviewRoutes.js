const express = require('express');
const { protect, restrictTo } = require('../controllers/authControllers');
const {
  getAllReview,
  createReview,
  setUserIdAndTourId,
  deleteReview,
  updateReview,
  getReview,
} = require('../controllers/reviewControllers');
const router = express.Router({ mergeParams: true });


router.use(protect)
router
  .route('/')
  .get( getAllReview)
  .post( restrictTo('user'), setUserIdAndTourId, createReview);
router
  .route('/:id')
  .patch(restrictTo('user'), updateReview)
  .delete( restrictTo('admin', 'user'), deleteReview)
  .get(getReview);

module.exports = router;
