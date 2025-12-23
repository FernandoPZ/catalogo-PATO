const { pool } = require('../config/db');
const { registrarAccion } = require('../utils/logger');
// 1. OBTENER HISTORIAL DE ENTRADAS
exports.getEntradas = async (req, res) => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT e."IdEntrada",
                   e."Fecha",
                   e."Total",
                   e."Comentarios",
                   p."NomProveedor",
                   p."RFC",
                   u."Nombre" as "Usuario"
                FROM "Entradas" e
                JOIN "Proveedores" p ON e."IdProveedor" = p."IdProveedor"
                LEFT JOIN "Usuario" u ON e."IdUsuarioCreacion" = u."IdUsuario"
                ORDER BY e."Fecha" DESC
                LIMIT 100
        `;
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener entradas' });
    } finally {
        client.release();
    }
};
// 2. REGISTRAR ENTRADA (COMPRA)
exports.createEntrada = async (req, res) => {
    const client = await pool.connect();
    try {
        const { IdProveedor, Total, Productos, Comentarios } = req.body;
        const IdUsuario = req.user.IdUsuario; 
        await client.query('BEGIN');
        const entradaQuery = `
            INSERT INTO "Entradas" 
                ("IdProveedor", "Total", "Comentarios", "IdUsuarioCreacion", "Fecha", "FechaCreacion")
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                RETURNING "IdEntrada"
        `;
        const entradaRes = await client.query(entradaQuery, [IdProveedor, Total, Comentarios, IdUsuario]);
        const IdEntrada = entradaRes.rows[0].IdEntrada;
        for (const prod of Productos) {
            const subtotal = prod.Cantidad * prod.Costo;
            const detalleQuery = `
                INSERT INTO "DetalleEntradas" ("IdEntrada", "IdArticulo", "Cantidad", "CostoUnitario", "Subtotal")
                    VALUES ($1, $2, $3, $4, $5)
            `;
            await client.query(detalleQuery, [IdEntrada, prod.IdArticulo, prod.Cantidad, prod.Costo, subtotal]);
            const stockQuery = `
                UPDATE "Articulos"
                    SET "StockActual" = "StockActual" + $1,
                        "FechaModificacion" = NOW(),
                        "IdUsuarioModificacion" = $2
                    WHERE "IdArticulo" = $3
            `;
            await client.query(stockQuery, [prod.Cantidad, IdUsuario, prod.IdArticulo]);
        }
        await client.query('COMMIT');
        if (IdUsuario) {
            await registrarAccion(
                IdUsuario, 
                'NUEVA_COMPRA', 
                `Registró entrada #${IdEntrada}. Total: $${Number(Total).toFixed(2)}. Items: ${Productos.length}`
            );
        }
        res.status(201).json({ msg: 'Entrada registrada correctamente', IdEntrada });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error en createEntrada:", error.message);
        res.status(500).json({ msg: 'Error al procesar entrada: ' + error.message });
    } finally {
        client.release();
    }
};
// 3. OBTENER DETALLES
exports.getDetalleEntrada = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        const query = `
            SELECT d."Cantidad",
                   d."CostoUnitario",
                   d."Subtotal",
                   a."NomArticulo",
                   a."CodArticulo",
                   a."Talla",
                   a."Color"
                FROM "DetalleEntradas" d
                JOIN "Articulos" a ON d."IdArticulo" = a."IdArticulo"
                WHERE d."IdEntrada" = $1
        `;
        const result = await client.query(query, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener detalles' });
    } finally {
        client.release();
    }
};