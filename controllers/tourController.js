const fs = require('fs');
const Tour = require('./../models/tourmodels');
const { error } = require('console');
const APIFeatures = require('../utils/apiFeatures');




// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req,res,next,val) =>{
//   if(req.params.id * 1 > tours.length){
//     return res.status(404).json({
//       status: 'fail',
//       message : 'Invalid ID'
//     })
//   }
//   next();
//   console.log(`Tour id is : ${val}`);
// }

// exports.checkBody = (req,res,next)=>{
//   if(!req.body.name || !req.body.price){
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Body is not as per requirements'
//     })
//   }
//   next();
  
// }
exports.aliasTopTours = async(req,res,next)=>{
  req.query.limit = '5';
  req.query.sort ='-ratingsAverage,price'
  next()
}




exports.getallTours = async(req, res) => {
  try{
    
    // 1. FILTERIGNG
    // const queryObj = {...req.query}
    // const excludeFields = ['page', 'sort' , 'limit','feilds']
    // excludeFields.forEach(el=> delete queryObj[el]);
    



    // // 2. ADVANCED FILTERING
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`);
    // // console.log(JSON.parse(queryStr));

    // // console.log(req.query , queryObj);
    // let query =  Tour.find (JSON.parse(queryStr))


    // 3.SORTING
    
    // if(req.query.sort){
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // }
    // else{
    //   query= query.sort('-createdAt')
    // }
 
    // 4. FIELD LIMITING
    // if(req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ');
    //   console.log(fields);
    //   query = query.select('name')
    // }
    // else{
    //   query = query.select('-__v');
    // }
    
    // // 5. PAGINATION
    // const page = req.query.page*1 || 1;
    // const limit = req.query.limit*1 ||100;
    // const skip = (page-1)* limit;
    // query = query.skip(skip).limit(limit);

    // if(req.query.page){
    //   const numTours = await Tour.countDocuments();
    //   if(skip>=numTours) throw new Error('This page does not exist');
    // }



    // AWAITING THE QUERY
    const features  = new APIFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    // const tours = await query;
    const tours = await features.query;

       // const tours = await Tour.find({
      //   duration: req.query.duration ,
      //   difficulty: req.query.difficulty
      // });
      // .where('duration').equals(req.query.duration)
      // .where('difficulty').equals(req.query.difficulty)

    //SENDING RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  }
  catch(error){
    console.log(error);
    res.status(404).json({
      status: 'fail',
      message: error
    })
  }
  };
  exports.getSpecificTour = async(req, res) => {
      //trick
      // const id = req.params.id * 1;
    
      // const tour = tours.find((el) => el.id === id);
      // if (!tour) {
      //   return res.status(404).json({
      //     status: 'fail',
      //     message: 'invalid object id',
      //   });
      // }
    try{
      const tour = await Tour.findById(req.params.id)
      res.status(200).json({
        status: 'success',
        results: tour .length,
        data: {
          tour: tour,
        },
      });
    }
    catch(err){
      res.status(404).json({
        status: 'fail',
        message: err
      })
    }
    } 
  exports.addNewTour = async(req, res) => {
    try
    {
      const newTour = await Tour.create(req.body)
  
      res.status(201).json({
              status: 'success',
              message: 'tour added succesfully',
              data: {
                tour: newTour,
              },
            });
      }
    catch(Error){
      res.status(400).json({
        staus: 'fail',
        message: Error
      })

    }
      // const newId = tours[tours.length - 1].id + 1;
      // const newTour = Object.assign({ id: newId }, req.body);
      // tours.push(newTour);
      // fs.writeFile(
      //   `${__dirname}/dev-data/data/tours-simple.json`,
      //   JSON.stringify(tours),
      //   (err) => {
      //     res.status(201).json({
      //       status: 'success',
      //       message: 'tour added succesfully',
      //       data: {
      //         tour: newTour,
      //       },
      //     });
      //   }
      // );
    }
  exports.modifyTour = async (req, res) => {
      // const id = req.params.id * 1;
      // const tour = tours.find((el) => el.id === id);
      try{
          const tour = await Tour.findByIdAndUpdate(req.params.id, req.body ,{
            new: true
          })
          res.status(200).json({
            status: 'success',
            messgae: 'update made successfully',
            Updated_tour : tour

          });
      } catch(err){
        res.status(400).json({
          staus: 'fail',
          message: err
        })
      }
    }
  exports.deleteTour =  async(req, res) => {
      // const id = req.params.id * 1;
      // const tour =  tours.find((el) => el.id === id);
    
    try{
      await Tour.findByIdAndDelete(req.params.id)

      res.status(204).json({
        status: 'success',
        data: 'null',
      });
    }catch(err){
      res.status(400).json({
        staus: 'fail',
        message: err
      })
     }
    }
  exports.getTourStats = async (req,res)=>{
    try{
      const stats =  await Tour.aggregate([
        {
          $match:{ratingsAverage :{$gte : 4.5}}
        },
        {
          $group : {
            _id: '$difficulty  ',
            numTours: {$sum: 1},
            numRatings: {$sum: '$ratingsQuantity'},
            avgRating: {$avg : '$ratingsAverage'},
            avgPrice : {$avg: '$price'},
            minPrice : {$min : '$price' },
            maxPrice : {$max: '$price'}
          }
        }
      ])
      res.status(200).json({
        status: 'success',
        data: {
          stats: stats
        },
      });

    }catch(err){
      res.status(400).json({
        staus: 'fail',
        message: err
      })
    }
  }
  