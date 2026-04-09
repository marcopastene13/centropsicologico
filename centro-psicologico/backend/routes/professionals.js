const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');
const auth = require('../middlewares/auth');

// Rutas públicas
router.get('/', professionalController.getAllProfessionals);
router.get('/:id', professionalController.getProfessionalById);
router.get('/:id/availability', professionalController.getAvailability);

// Rutas protegidas (solo admin)
router.post('/', auth, professionalController.createProfessional);
router.put('/:id', auth, professionalController.updateProfessional);
router.delete('/:id', auth, professionalController.deleteProfessional);

module.exports = router;
