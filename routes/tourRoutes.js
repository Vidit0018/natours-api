
const express = require('express');
const tourController = require('./../controllers/tourController')

const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkID);
tourRouter.route('/tour-stats').get(tourController.getTourStats)
tourRouter.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getallTours);
tourRouter.route('/')
.get(tourController.getallTours)
.post(tourController.addNewTour);
tourRouter.route('/:id')
.get(tourController.getSpecificTour)
.patch(tourController.modifyTour)
.delete(tourController.deleteTour);

module.exports = tourRouter;