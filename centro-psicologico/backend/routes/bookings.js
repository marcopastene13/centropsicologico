const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middlewares/validate');
const auth = require('../middlewares/auth');

// Rutas públicas
router.get('/available-slots', bookingController.getAvailableSlots);
router.post('/', validateBooking, bookingController.createBooking);

// Rutas protegidas (requieren autenticación)
router.get('/', auth, bookingController.getAllBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.put('/:id', auth, bookingController.updateBooking);
router.delete('/:id', auth, bookingController.deleteBooking);

module.exports = router;
