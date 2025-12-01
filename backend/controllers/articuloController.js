const { pool } = require('../config/db');

exports.getArticulos = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT A."IdArticulo",
                    A."CodArticulo",
                    A."NomArticulo",
                    A."StockActual", 
                    A."PrecioVenta",  -- <--- NUEVO CAMPO
                    A."FechaAlta", 
                    CS."CantidadMaxima",
                    CS."CantidadMinima", 
                    P."NomProveedor"
                FROM "Articulos" AS A
                JOIN "CfgStock" AS CS ON A."IdCfgStock" = CS."IdCfgStock"
                LEFT JOIN "Proveedores" AS P ON A."IdProveedor" = P."IdProveedor"
                WHERE A."BajaLogica" IS NOT TRUE -- CORRECCIÓN: Traer NO eliminados
                ORDER BY A."NomArticulo" ASC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    } finally {
        client.release();
    }
};

exports.getArticuloById = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT A."IdArticulo",
                    A."CodArticulo",
                    A."NomArticulo",
                    A."StockActual", 
                    A."PrecioVenta", -- <--- NUEVO CAMPO
                    A."IdProveedor",
                    A."IdCfgStock",
                    CS."CantidadMaxima",
                    CS."CantidadMinima"
                FROM "Articulos" AS A
                JOIN "CfgStock" AS CS ON A."IdCfgStock" = CS."IdCfgStock"
                WHERE A."IdArticulo" = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Artículo no encontrado.' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener artículo:', error);
        res.status(500).json({ msg: 'Error interno.' });
    } finally {
        client.release();
    }
};

exports.createArticulo = async (req, res) => {
    const { CodArticulo, NomArticulo, IdProveedor, CantidadMaxima, CantidadMinima, PrecioVenta, StockActual } = req.body;
    const IdUsuario = req.user ? req.user.IdUsuario : null; 
    if (!NomArticulo || !IdProveedor) {
        return res.status(400).json({ msg: 'Nombre y Proveedor son obligatorios.' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const cfgQuery = `
            INSERT INTO "CfgStock" ("CantidadMaxima", "CantidadMinima", "FechaAlta", "BajaLogica") 
            VALUES ($1, $2, NOW(), FALSE) 
            RETURNING "IdCfgStock"
        `;
        const cfgRes = await client.query(cfgQuery, [CantidadMaxima || 0, CantidadMinima || 0]);
        const IdCfgStock = cfgRes.rows[0].IdCfgStock;
        const artQuery = `
            INSERT INTO "Articulos" (
                "CodArticulo", "NomArticulo", "IdProveedor", "IdCfgStock", 
                "StockActual", "PrecioVenta", 
                "FechaAlta", "BajaLogica", 
                "IdUsuarioCreacion", "FechaCreacion"
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), FALSE, $7, NOW()) 
            RETURNING *
        `;
        const result = await client.query(artQuery, [
            CodArticulo || '', 
            NomArticulo, 
            IdProveedor, 
            IdCfgStock, 
            StockActual || 0, 
            PrecioVenta || 0, 
            IdUsuario
        ]);
        await client.query('COMMIT');
        res.status(201).json({ msg: 'Artículo creado', articulo: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear artículo:', error);
        res.status(500).json({ msg: 'Error interno al crear artículo.' });
    } finally {
        client.release();
    }
};

exports.updateArticulo = async (req, res) => {
    const { id } = req.params;
    const { NomArticulo, CantidadMaxima, CantidadMinima, IdProveedor, PrecioVenta } = req.body;
    const IdUsuario = req.user.IdUsuario;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const artCheck = await client.query('SELECT "IdCfgStock" FROM "Articulos" WHERE "IdArticulo" = $1', [id]);
        if (artCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: 'Artículo no encontrado.' });
        }
        const IdCfgStock = artCheck.rows[0].IdCfgStock;
        await client.query(
            'UPDATE "CfgStock" SET "CantidadMaxima" = $1, "CantidadMinima" = $2 WHERE "IdCfgStock" = $3',
            [CantidadMaxima, CantidadMinima, IdCfgStock]
        );
        const updateQuery = `
            UPDATE "Articulos" SET 
                "NomArticulo" = $1, 
                "IdProveedor" = $2, 
                "PrecioVenta" = $3,
                "IdUsuarioModificacion" = $4, 
                "FechaModificacion" = NOW() 
            WHERE "IdArticulo" = $5 RETURNING *
        `;
        const result = await client.query(updateQuery, [NomArticulo, IdProveedor, PrecioVenta, IdUsuario, id]);
        await client.query('COMMIT');
        res.json({ msg: 'Artículo actualizado', articulo: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar:', error);
        res.status(500).json({ msg: 'Error interno.' });
    } finally {
        client.release();
    }
};

exports.deleteArticulo = async (req, res) => {
    const { id } = req.params;
    const IdUsuario = req.user.IdUsuario;
    const client = await pool.connect();
    try {
        const query = `
            UPDATE "Articulos" SET 
                "BajaLogica" = TRUE,
                "IdUsuarioModificacion" = $1,
                "FechaModificacion" = NOW()
            WHERE "IdArticulo" = $2
        `;
        await client.query(query, [IdUsuario, id]);
        res.json({ msg: 'Artículo eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).json({ msg: 'Error interno.' });
    } finally {
        client.release();
    }
};