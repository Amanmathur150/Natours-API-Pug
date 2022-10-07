const Stripe = require('stripe');
const Booking = require('../models/bookingModel');
const Tour = require("../models/tourModel");
const User = require('../models/userModel');

const catchAsync = require("../utils/catchAsync");
const { createOne, getOne, getAll, updateOne, deleteOne } = require('./handleFactoy');


exports.alertMessage =(req,res,next)=>{
    if(req.query.alert === "Booking"){
        res.locals.alert = "Your Booking was successfull! Please check your email for a confirmation. if your booking doesn't show up here imediately, please come back later."
        return next()
    }  
    next()
}

exports.getCheckoutSession = catchAsync( async (req,res,next) =>{
    const tour = await Tour.findById(req.params.tourId)
   
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types : ["card"],
        success_url : `${req.protocol}://${req.get("host")}/my-bookings?alert=Booking`,
        cancel_url : `${req.protocol}://${req.get("host")}/payment/cancel`,
        customer_email : req.user.email , 
        client_reference_id: tour._id.toString(),
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

// exports.getPaymentDone = catchAsync(async(req,res,next)=>{
//     const {user,tour,price} = req.query
//     if (user && tour&& price){
//         await Booking.create({
//             user,tour,price
//         })
//         return res.redirect("/payment/success")
//     }
//     next()
// })

const createBookingCheckout= async(session)=>{
    console.log(session)
  
    const user =   await User.findOne({email : session.customer_details.email})._id
    const tour = session.client_reference_id
    const price = session.amount_total /100
    if (user && tour&& price){
        await Booking.create({
            user,tour,price
        })
      
    }
}
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

exports.webhookCheckout = catchAsync(async(req,res,next)=>{
    // process.env.WEBHOOK_SECRET
    const endpointSecret = process.env.WEBHOOK_SECRET
    const sig = req.headers['stripe-signature'];

    let event;
  
    try {
      event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
   
        createBookingCheckout(session)
        // Then define and call a function to handle the event checkout.session.completed
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({received : true});
})

exports.createBooking = createOne(Booking)
exports.getBooking = getOne(Booking)
exports.getAllBooking = getAll(Booking)
exports.updateBooking = updateOne(Booking)
exports.deleteBooking = deleteOne(Booking)