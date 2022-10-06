const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const { Model } = require("mongoose");
const APIfilter = require('../utils/APIfilters');


exports.updateOne = Model => catchAsync(async (req, res,next) => {
    const { id } = req.params;
  
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
  
    if(!doc){
      return next(new AppError("No document found with that Id" , 404))
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  })

exports.createOne = Model =>catchAsync(async (req,res,next)=>{
    const doc = await Model.create(req.body)

    res.status(201).json({
        status : "success",
        data :{
            doc
        }
    })
})

exports.deleteOne = Model =>catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const doc= await Model.findByIdAndDelete(id);
    if(!doc){
      return next(new AppError("No Document found with that Id" , 404))
    }
    res.status(204).json({
        status: 'success',
        data: null
      });
  });
exports.getOne = (Model,populateOptions) =>catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const query =  Model.findById(id)

    if(populateOptions) query.populate(populateOptions);

    const doc = await query
  
  
    if(!doc){
      return next(new AppError("No document found with that Id" , 404))
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  }
  );

  exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {}
    if(req.params.tourId) filter = {tour : req.params.tourId}

    const query = new APIfilter(Model.find(filter), req.query)
      .filter()
      .fieldsLimit()
      .limit()
      .pagination()
      .sort();
    const doc = await query.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });