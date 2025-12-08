const { pool } = require('../config/db');

// Obtener puntos activos
exports.getPuntos = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM "PuntosEntrega" WHERE "Activo" = TRUE ORDER BY "NombrePunto" ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener puntos' });
    } finally {
        client.release();
    }
};

// Crear punto
exports.createPunto = async (req, res) => {
    const { NombrePunto, LinkGoogleMaps } = req.body;
    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO "PuntosEntrega" ("NombrePunto", "LinkGoogleMaps", "Activo") VALUES ($1, $2, TRUE) RETURNING *',
            [NombrePunto, LinkGoogleMaps]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear punto' });
    } finally {
        client.release();
    }
};

// Eliminar (Desactivar)
exports.deletePunto = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('UPDATE "PuntosEntrega" SET "Activo" = FALSE WHERE "IdPunto" = $1', [id]);
        res.json({ msg: 'Punto eliminado' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar punto' });
    } finally {
        client.release();
    }
};