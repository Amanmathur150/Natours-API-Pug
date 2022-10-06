const catchAsync = fn =>{
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>{
            // ERROR SEND TO HANDLE NEXT ERROR HANDLE MIDDLEWERE
            next(err)
        })
    }
}

module.exports = catchAsync