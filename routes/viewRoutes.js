const express = require('express');
const { protect, restrictTo, loggedIn, loggedOut } = require('../controllers/authControllers');
const { getPaymentSuccess, getPaymentCancel, getPaymentDone, getMyBookings } = require('../controllers/bookingControllers');
const { getOverview, getTours, getLoginForm, getAccount } = require('../controllers/viewControllers');



const viewRoute = express.Router();

// viewRoute.use(loggedIn)
viewRoute.get("/",loggedIn,getPaymentDone,getOverview)
viewRoute.get("/payment/success",loggedIn,getPaymentSuccess)
viewRoute.get("/payment/cancel",loggedIn,getPaymentCancel)

viewRoute.get("/tour/:slug",loggedIn,getTours)
viewRoute.get("/login",loggedIn,getLoginForm)
viewRoute.get("/logout",loggedOut)
viewRoute.get("/me",protect,getAccount)
viewRoute.get("/my-bookings",protect,getMyBookings)

module.exports = viewRoute;
