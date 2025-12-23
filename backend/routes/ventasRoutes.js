const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, ventasController.getVentas);
router.get('/:id/detalles', protect, ventasController.getVentaDetalles);
router.post('/', protect, ventasController.crearVenta);

module.exports = router;