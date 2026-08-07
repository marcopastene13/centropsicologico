const express = require('express');
const router = express.Router();
const { getAvailableSlots, createBooking, getAllBookings, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');
const verifyToken = require('../middlewares/auth');

router.get('/available', getAvailableSlots);
router.post('/', createBooking);
router.get('/', verifyToken, getAllBookings);
router.patch('/:id/status', verifyToken, updateBookingStatus);
router.delete('/:id', verifyToken, deleteBooking);

module.exports = router;