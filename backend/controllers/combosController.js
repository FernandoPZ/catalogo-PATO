const { pool } = require('../config/db');

exports.getCombos = async (req, res) => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT "IdCombo", "Nombre", "Codigo", "Precio", "Activo"
            FROM "Combos"
            WHERE "Activo" = true
            ORDER BY "Nombre" ASC
        `;
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener kits' });
    } finally {
        client.release();
    }
};
exports.getComboById = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        const headerRes = await client.query('SELECT * FROM "Combos" WHERE "IdCombo" = $1', [id]);
        if (headerRes.rows.length === 0) return res.status(404).json({ msg: 'Kit no encontrado' });
        const detailQuery = `
            SELECT dc."IdArticulo", a."NomArticulo", dc."Cantidad"
            FROM "DetalleCombos" dc
            JOIN "Articulos" a ON dc."IdArticulo" = a."IdArticulo"
            WHERE dc."IdCombo" = $1
        `;
        const detailRes = await client.query(detailQuery, [id]);
        res.json({ ...headerRes.rows[0], ingredientes: detailRes.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener detalle del kit' });
    } finally {
        client.release();
    }
};
exports.createCombo = async (req, res) => {
    const { Nombre, Codigo, Precio, Ingredientes } = req.body;
    const IdUsuario = req.user.IdUsuario; 
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const headerQuery = `
            INSERT INTO "Combos" ("Nombre", "Codigo", "Precio", "Activo", "IdUsuarioCreacion", "FechaCreacion")
            VALUES ($1, $2, $3, true, $4, NOW())
            RETURNING "IdCombo"
        `;
        const headerRes = await client.query(headerQuery, [Nombre, Codigo, Precio, IdUsuario]);
        const IdCombo = headerRes.rows[0].IdCombo;
        for (const item of Ingredientes) {
            await client.query(
                'INSERT INTO "DetalleCombos" ("IdCombo", "IdArticulo", "Cantidad") VALUES ($1, $2, $3)',
                [IdCombo, item.IdArticulo, item.Cantidad]
            );
        }
        await client.query('COMMIT');
        res.status(201).json({ msg: 'Kit creado exitosamente', IdCombo });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ msg: 'Error al crear kit' });
    } finally {
        client.release();
    }
};
exports.updateCombo = async (req, res) => {
    const { id } = req.params;
    const { Nombre, Codigo, Precio, Ingredientes } = req.body;
    const IdUsuario = req.user.IdUsuario;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const headerQuery = `
            UPDATE "Combos"
            SET "Nombre" = $1, "Codigo" = $2, "Precio" = $3, 
                "IdUsuarioModificacion" = $4, "FechaModificacion" = NOW()
            WHERE "IdCombo" = $5
        `;
        await client.query(headerQuery, [Nombre, Codigo, Precio, IdUsuario, id]);
        await client.query('DELETE FROM "DetalleCombos" WHERE "IdCombo" = $1', [id]);
        for (const item of Ingredientes) {
            await client.query(
                'INSERT INTO "DetalleCombos" ("IdCombo", "IdArticulo", "Cantidad") VALUES ($1, $2, $3)',
                [id, item.IdArticulo, item.Cantidad]
            );
        }
        await client.query('COMMIT');
        res.json({ msg: 'Kit actualizado' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar kit' });
    } finally {
        client.release();
    }
};
exports.deleteCombo = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('UPDATE "Combos" SET "Activo" = false WHERE "IdCombo" = $1', [id]);
        res.json({ msg: 'Kit eliminado (desactivado)' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar' });
    } finally {
        client.release();
    }
};