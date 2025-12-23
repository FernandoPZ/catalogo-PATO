const { pool } = require('../config/db');
const { registrarAccion } = require('../utils/logger');
// 1. OBTENER ARTÍCULOS
exports.getArticulos = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT A."IdArticulo",
                    A."CodArticulo",
                    A."NomArticulo",
                    A."StockActual", 
                    A."PrecioVenta",
                    A."FechaAlta",
                    A."Categoria",
                    A."Talla",
                    A."Color",
                    A."DetallesTecnicos",
                    CS."CantidadMaxima",
                    CS."CantidadMinima",
                    P."NomProveedor"
                FROM "Articulos" AS A
                JOIN "CfgStock" AS CS ON A."IdCfgStock" = CS."IdCfgStock"
                LEFT JOIN "Proveedores" AS P ON A."IdProveedor" = P."IdProveedor"
                WHERE A."BajaLogica" IS NOT TRUE
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
// 2. OBTENER UN ARTÍCULO
exports.getArticuloById = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT A."IdArticulo",
                    A."CodArticulo",
                    A."NomArticulo",
                    A."StockActual", 
                    A."PrecioVenta",
                    A."IdProveedor",
                    A."IdCfgStock",
                    A."Categoria",
                    A."Talla",
                    A."Color",
                    A."DetallesTecnicos",
                    CS."CantidadMaxima",
                    CS."CantidadMinima"
                FROM "Articulos" AS A
                JOIN "CfgStock" AS CS ON A."IdCfgStock" = CS."IdCfgStock"
                WHERE A."IdArticulo" = $1`, [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ msg: 'Artículo no encontrado.' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Error interno.' });
    } finally {
        client.release();
    }
};
// 3. CREAR ARTÍCULO (Con Bitácora)
exports.createArticulo = async (req, res) => {
    const { 
        CodArticulo, NomArticulo, IdProveedor, CantidadMaxima, CantidadMinima, 
        PrecioVenta, Categoria, Talla, Color, DetallesTecnicos 
    } = req.body;
    
    const StockInicial = 0; 

    const IdUsuario = req.user ? req.user.IdUsuario : null; 

    if (!NomArticulo || !IdProveedor) return res.status(400).json({ msg: 'Datos incompletos.' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const cfgRes = await client.query(
            `INSERT INTO "CfgStock" ("CantidadMaxima", "CantidadMinima", "FechaAlta", "BajaLogica") 
                VALUES ($1, $2, NOW(), FALSE) RETURNING "IdCfgStock"`,
            [CantidadMaxima || 0, CantidadMinima || 0]
        );
        const IdCfgStock = cfgRes.rows[0].IdCfgStock;
        const artQuery = `
            INSERT INTO "Articulos" ("CodArticulo", "NomArticulo", "IdProveedor", "IdCfgStock",
                                     "StockActual", "PrecioVenta", "FechaAlta", "BajaLogica",
                                     "IdUsuarioCreacion", "FechaCreacion",
                                     "Categoria", "Talla", "Color", "DetallesTecnicos")
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), FALSE, $7, NOW(), $8, $9, $10, $11)
                RETURNING *
        `;
        const result = await client.query(artQuery, [
            CodArticulo || '', NomArticulo, IdProveedor, IdCfgStock, 
            StockInicial, // Forzamos 0 o el valor que decidas
            PrecioVenta || 0, IdUsuario,
            Categoria || 'GENERAL', Talla || null, Color || null, DetallesTecnicos || ''
        ]);
        await client.query('COMMIT');
        if (IdUsuario) {
            await registrarAccion(IdUsuario, 'CREAR_ARTICULO', `Alta de producto: ${NomArticulo} (${Categoria})`);
        }
        res.status(201).json({ msg: 'Artículo creado', articulo: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error crear:', error);
        res.status(500).json({ msg: 'Error interno.' });
    } finally {
        client.release();
    }
};
// 4. ACTUALIZAR ARTÍCULO (Con Bitácora)
exports.updateArticulo = async (req, res) => {
    const { id } = req.params;
    const { 
        NomArticulo, CantidadMaxima, CantidadMinima, IdProveedor, PrecioVenta,
        Categoria, Talla, Color, DetallesTecnicos 
    } = req.body;
    const IdUsuario = req.user.IdUsuario;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const artCheck = await client.query('SELECT "IdCfgStock" FROM "Articulos" WHERE "IdArticulo" = $1', [id]);
        if (artCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: 'No encontrado.' });
        }
        await client.query(
            'UPDATE "CfgStock" SET "CantidadMaxima" = $1, "CantidadMinima" = $2 WHERE "IdCfgStock" = $3',
            [CantidadMaxima, CantidadMinima, artCheck.rows[0].IdCfgStock]
        );
        const updateQuery = `
            UPDATE "Articulos" SET
                   "NomArticulo" = $1,
                   "IdProveedor" = $2,
                   "PrecioVenta" = $3,
                   "Categoria" = $4,
                   "Talla" = $5,
                   "Color" = $6,
                   "DetallesTecnicos" = $7,
                   "IdUsuarioModificacion" = $8,
                   "FechaModificacion" = NOW()
                WHERE "IdArticulo" = $9 RETURNING *
        `;
        const result = await client.query(updateQuery, [
            NomArticulo, IdProveedor, PrecioVenta, Categoria, Talla, Color, DetallesTecnicos,
            IdUsuario, id
        ]);
        await client.query('COMMIT');
        if (IdUsuario) {
            await registrarAccion(IdUsuario, 'EDITAR_ARTICULO', `Modificó producto ID ${id}: ${NomArticulo}`);
        }
        res.json({ msg: 'Artículo actualizado', articulo: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error actualizar:', error);
        res.status(500).json({ msg: 'Error interno.' });
    } finally {
        client.release();
    }
};
// 5. ELIMINAR ARTÍCULO (Con Bitácora)
exports.deleteArticulo = async (req, res) => {
    const { id } = req.params;
    const IdUsuario = req.user.IdUsuario;
    const client = await pool.connect();
    try {
        await client.query(`
            UPDATE "Articulos" SET "BajaLogica" = TRUE, "IdUsuarioModificacion" = $1, "FechaModificacion" = NOW()
            WHERE "IdArticulo" = $2
        `, [IdUsuario, id]);
        if (IdUsuario) {
            await registrarAccion(IdUsuario, 'BAJA_ARTICULO', `Eliminó producto ID ${id}`);
        }
        res.json({ msg: 'Artículo eliminado.' });
    } catch (error) {
        console.error('Error eliminar:', error);
        res.status(500).json({ msg: 'Error interno.' });
    } finally {
        client.release();
    }
};