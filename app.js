// IMPORTS
const express = require("express")
var morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const compression = require('compression')
const tourRoute = require("./routes/tourRoutes")
const AppError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorControllers")
const userRoute = require("./routes/userRoutes")
const reviewRoute = require("./routes/reviewRoutes")
const viewRoute = require("./routes/viewRoutes")
const bookingRoute = require("./routes/bookingRoutes")
const { webhookCheckout } = require("./controllers/bookingControllers")

app.enable("trust proxy")


app.set("view engine" , "pug")

app.post('/webhook-payment', express.raw({type: 'application/json'}),webhookCheckout)


app.use(cors())
// app.use(cors({
//     origin : "Your website name "
// }))
app.options("*",cors())

app.use(express.static(path.join(__dirname , "public")) )

// MIDDLEWERE 
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())


app.use(compression())

// Api ROUTES
app.use("/",viewRoute)
app.use("/api/v1/users",userRoute)
app.use("/api/v1/tours",tourRoute)
app.use("/api/v1/reviews",reviewRoute)
app.use("/api/v1/bookings",bookingRoute)



app.all("*",(req,res,next)=>{
// CHANGE THE ERROR HANDLING BEHAVIOUR TO SEND ERROR TO NEXT MIDDLEWERE TO HANDLE ERRORS 
    // NEXT FUNCTION ACCEPTS ONLY ERROR IN THAT CASE B'COZE WE SET ERROR 
   next(new AppError(`Can't find ${req.method} ${req.originalUrl} on this server`,500))
})

// ERROR HANDLER MIDDLEWERE
app.use(globalErrorHandler)



module.exports = app