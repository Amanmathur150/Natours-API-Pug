const Stripe = require('stripe');
const Booking = require('../models/bookingModel');
const Tour = require("../models/tourModel");

const catchAsync = require("../utils/catchAsync");
const { createOne, getOne, getAll, updateOne, deleteOne } = require('./handleFactoy');


exports.getCheckoutSession = catchAsync( async (req,res,next) =>{
    const tour = await Tour.findById(req.params.tourId)
   
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
        payment_method_types : ["card"],
        success_url : `${req.protocol}://${req.get("host")}/?user=${req.user._id}&tour=${tour._id}&price=${tour.price}`,
        cancel_url : `${req.protocol}://${req.get("host")}/payment/cancel`,
        customer_email : req.user.email , 
        client_reference_id: tour._id,
        mode: 'payment',
        line_items : [{
            quantity : 1,
            price_data: {
                currency: 'usd',
                unit_amount: tour.price *100,
                product_data: {
                  name: `${tour.name} Tour` ,
                  description: tour.summary , 
                  images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                },
              },
        }]
    })
  
    res.status(200).json({
        status :"success",
        session
    })
    
    
})
exports.getPaymentSuccess = catchAsync( async (req,res,next) =>{
 
    res.render("paymentSuccess")
    
})
exports.getPaymentCancel = catchAsync( async (req,res,next) =>{
   
    res.render("paymentCancel")
    
})

exports.getPaymentDone = catchAsync(async(req,res,next)=>{
    const {user,tour,price} = req.query
    if (user && tour&& price){
        await Booking.create({
            user,tour,price
        })
        return res.redirect("/payment/success")
    }
    next()
})
exports.getMyBookings = catchAsync(async(req,res,next)=>{
    const myBookings = await Booking.find({user:req.user._id})
    const tourIds = myBookings.map(el => el.tour._id.toString())
    const tours = await Tour.find({ _id :{
        $in: tourIds }
    })

    res.render("overview",{
        title:"My Bookings",
        tours
    })
})

exports.createBooking = createOne(Booking)
exports.getBooking = getOne(Booking)
exports.getAllBooking = getAll(Booking)
exports.updateBooking = updateOne(Booking)
exports.deleteBooking = deleteOne(Booking)