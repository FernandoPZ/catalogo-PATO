const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener lista de combos activos
router.get('/', async (req, res) => {
    try {
        const query = `SELECT * FROM "Combos" WHERE "Activo" = true ORDER BY "Nombre" ASC`;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener combos' });
    }
});

module.exports = router;