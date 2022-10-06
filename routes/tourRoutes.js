const express = require('express');
const { protect, restrictTo } = require('../controllers/authControllers');
const {
  getAllTour,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  aliasTopTour,
  monthlyPlan,
  getToursWithin,
  getDistances
} = require('../controllers/tourControllers');
const { tourImagesUpload, resizeTourImages } = require('../controllers/userControllers');
const reviewRoute = require('./reviewRoutes');
const tourRoute = express.Router({ mergeParams: true });

tourRoute.use('/:tourId/review', reviewRoute);
tourRoute.route('/top-5-cheap').get(aliasTopTour, getAllTour);

tourRoute.route('/tour-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);
tourRoute.route('/distances/:latlng/unit/:unit').get(getDistances);

tourRoute.use(protect)

tourRoute.route('/').get(protect, getAllTour).post(createTour);
tourRoute.route('/monthly-plan/:year').get(restrictTo("admin","lead-guide" , "guide"),monthlyPlan);
tourRoute
  .route('/:id')
  .get(getTour)
  .patch(restrictTo('admin', 'lead-guide') ,tourImagesUpload, resizeTourImages,updateTour)
  .delete(restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = tourRoute;
