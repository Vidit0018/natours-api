
const express = require('express');
const tourController = require('./../controllers/tourController')

const tourRouter = express.Router();

tourRouter.param('id', tourController.checkID);

tourRouter.route('/')
.get(tourController.getallTours)
.post(tourController.checkBody,tourController.addNewTour);
tourRouter.route('/:id')
.get(tourController.getSpecificTour)
.patch(tourController.modifyTour)
.delete(tourController.deleteTour);

module.exports = tourRouter;