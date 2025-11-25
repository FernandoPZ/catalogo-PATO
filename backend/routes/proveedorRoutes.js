// backend/routes/proveedorRoutes.js
const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { protect } = require('../middlewares/authMiddleware');

// 1. Listar TODOS los proveedores
router.get('/proveedores', protect, proveedorController.getProveedores);
// 2. Obtener UNO solo por ID
router.get('/proveedores/:id', protect, proveedorController.getProveedorById);
// 3. Crear proveedor
router.post('/proveedores', protect, proveedorController.createProveedor);
// 4. Editar proveedor
router.put('/proveedores/:id', protect, proveedorController.updateProveedor);
// 5. Eliminar proveedor (baja lógica)
router.delete('/proveedores/:id', protect, proveedorController.deleteProveedor);

module.exports = router;
