const express = require('express');
const router = express.Router();
const entradasController = require('../controllers/entradasController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, entradasController.getEntradas);
router.post('/', protect, entradasController.createEntrada);

module.exports = router;