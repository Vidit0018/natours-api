const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req,res,next,val) =>{
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
      status: 'fail',
      message : 'Invalid ID'
    })
  }
  next();
  console.log(`Tour id is : ${val}`);
}

exports.checkBody = (req,res,next)=>{
  if(!req.body.name || !req.body.price){
    return res.status(404).json({
      status: 'fail',
      message: 'Body is not as per requirements'
    })
  }
  next();
  
}


exports.getallTours = (req, res) => {
    console.log(req.requestTime)
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  };
  exports.getSpecificTour = (req, res) => {
      //trick
      const id = req.params.id * 1;
    
      const tour = tours.find((el) => el.id === id);
      if (!tour) {
        return res.status(404).json({
          status: 'fail',
          message: 'invalid object id',
        });
      }
    
      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tour: tour,
        },
      });
    } 
  exports.addNewTour = (req, res) => {
      const newId = tours[tours.length - 1].id + 1;
      const newTour = Object.assign({ id: newId }, req.body);
      tours.push(newTour);
      fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
          res.status(201).json({
            status: 'success',
            message: 'tour added succesfully',
            data: {
              tour: newTour,
            },
          });
        }
      );
    }
  exports.modifyTour =  (req, res) => {
      const id = req.params.id * 1;
      const tour = tours.find((el) => el.id === id);
    
    
      res.status(200).json({
        status: 'success',
        messgae: 'update made successfully',
      });
    }
  exports.deleteTour =  (req, res) => {
      const id = req.params.id * 1;
      const tour = tours.find((el) => el.id === id);
    
    
      res.status(204).json({
        status: 'success',
        data: 'null',
      });
    }
  
  