const express = require('express');
const { protect, restrictTo } = require('../controllers/authControllers');
const { getCheckoutSession , getMyBookings, getAllBooking, createBooking, getBooking, updateBooking, deleteBooking } = require('../controllers/bookingControllers');


const bookingRoute = express.Router();
bookingRoute.use(protect) 
bookingRoute.get("/cookies-session/:tourId",getCheckoutSession)
bookingRoute.get("/my-booking",getMyBookings)

bookingRoute.use(restrictTo("admin","lead-guide"))
bookingRoute.route("/").get(getAllBooking).post(createBooking)
bookingRoute.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking)
module.exports = bookingRoute;
