const { pool } = require('../config/db');
// 1. OBTENER CONFIGURACIÓN
exports.getConfig = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM "Configuracion" LIMIT 1');
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener configuración' });
    } finally {
        client.release();
    }
};
// 2. ACTUALIZAR CONFIGURACIÓN
exports.updateConfig = async (req, res) => {
    const { NombreTienda, Direccion, Telefono, MensajeTicket, RedSocial } = req.body;
    const client = await pool.connect();
    try {
        const query = `
            UPDATE "Configuracion"
                SET "NombreTienda" = $1,
                    "Direccion" = $2,
                    "Telefono" = $3, 
                    "MensajeTicket" = $4,
                    "RedSocial" = $5
                WHERE "IdConfig" = (SELECT "IdConfig" FROM "Configuracion" LIMIT 1)
                RETURNING *
        `;
        const result = await client.query(query, [NombreTienda, Direccion, Telefono, MensajeTicket, RedSocial]);
        res.json({ msg: 'Tienda actualizada', config: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar configuración' });
    } finally {
        client.release();
    }
};