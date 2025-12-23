const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articuloController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/articulos/:id', protect, articuloController.getArticuloById);
router.get('/articulos', protect, articuloController.getArticulos);
router.post('/articulos', protect, articuloController.createArticulo);
router.put('/articulos/:id', protect, articuloController.updateArticulo);
router.delete('/articulos/:id', protect, articuloController.deleteArticulo);

module.exports = router;