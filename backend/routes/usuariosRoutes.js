const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const bcrypt = require('bcryptjs'); 

router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM "Usuario" WHERE "BajaLogica" IS NOT true ORDER BY "IdUsuario" ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

router.post('/', async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const query = `
            INSERT INTO "Usuario" ("Nombre", "Email", "PasswordHash", "Rol", "BajaLogica")
            VALUES ($1, $2, $3, $4, false)
            RETURNING *;
        `;
        
        const newUsuario = await db.query(query, [nombre, email, passwordHash, rol]);
        
        res.status(201).json({ message: 'Usuario creado', user: newUsuario.rows[0] });

    } catch (error) {
        console.error('Error al crear:', error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    try {
        const query = `
            UPDATE "Usuario"
            SET "Nombre" = $1, "Email" = $2, "Rol" = $3
            WHERE "IdUsuario" = $4
            RETURNING *;
        `;

        const updatedUser = await db.query(query, [nombre, email, rol, id]);

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado', user: updatedUser.rows[0] });

    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            UPDATE "Usuario"
            SET "BajaLogica" = true
            WHERE "IdUsuario" = $1
            RETURNING *;
        `;

        const result = await db.query(query, [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario desactivado correctamente (Soft Delete)' });
    } catch (error) {
        console.error('Error al desactivar:', error);
        res.status(500).json({ message: 'Error al desactivar usuario' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT "IdUsuario", "Nombre", "Email", "Rol" 
            FROM "Usuario" 
            WHERE "IdUsuario" = $1 AND "BajaLogica" IS NOT true
        `;
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

module.exports = router;
