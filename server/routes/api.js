const express = require('express');

const router = express.Router();
const userController = require('../controllers/usersController');
const locationController = require('../controllers/locationsController');
const ratingController = require('../controllers/ratingsController');

router.get('/users', userController.getUser);
router.post('/users', userController.postUser, (req, res, next) => res.send(res.locals.result));

router.get('/location', locationController.getLocation);
router.post('/location', locationController.postLocation);
router.put('/location', locationController.postLocation);
router.delete('/location', locationController.postLocation);

router.get('/rating', locationController.getLocation);
router.post('/rating', locationController.postLocation);
router.put('/rating', locationController.postLocation);

// // get User Info
// router.get('/user', (req, res, next) => res.send('Hello, world'));

// router.post('/user', (req, res, next) => res.send('Hello, world'));

module.exports = router;
