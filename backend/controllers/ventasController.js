const { pool } = require('../config/db');
// 1. OBTENER VENTAS
exports.getVentas = async (req, res) => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT v."IdVenta", 
                   v."Fecha", 
                   v."Total", 
                   v."Estado", 
                   v."ClienteNombre",
                   COALESCE(u."Nombre", 'Vendedor no registrado') as "Vendedor"
                FROM "Ventas" v
                LEFT JOIN "Usuario" u ON v."IdUsuario" = u."IdUsuario"
                ORDER BY v."Fecha" DESC
        `;
        const result = await client.query(query);
        console.log("Ventas encontradas:", result.rows.length); 
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ message: 'Error al obtener ventas' });
    } finally {
        client.release();
    }
};
// 2. OBTENER DETALLES DE UNA VENTA POR ID
exports.getVentaDetalles = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        const query = `
            SELECT dv."Cantidad",
                   dv."PrecioUnitario",
                   dv."Subtotal",
                   COALESCE(a."NomArticulo", c."Nombre", 'Producto Eliminado') as "Producto",
                   CASE WHEN dv."IdCombo" IS NOT NULL THEN 'COMBO' ELSE 'ARTICULO' END as "Tipo"
                FROM "DetalleVentas" dv
                LEFT JOIN "Articulos" a ON dv."IdArticulo" = a."IdArticulo"
                LEFT JOIN "Combos" c ON dv."IdCombo" = c."IdCombo"
                WHERE dv."IdVenta" = $1
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
// 3. CREAR VENTA
exports.crearVenta = async (req, res) => {
    const client = await pool.connect();
    try {
        const { idUsuario, total, productos, clienteNombre } = req.body;

        await client.query('BEGIN'); 
        
        const ventaQuery = `
            INSERT INTO "Ventas" ("IdUsuario", "Total", "Fecha", "Estado", "ClienteNombre")
                VALUES ($1, $2, NOW(), 'COMPLETADA', $3)
                RETURNING "IdVenta";
        `;
        const ventaResult = await client.query(ventaQuery, [idUsuario, total, clienteNombre || 'Público General']);
        const idVenta = ventaResult.rows[0].IdVenta;

        for (const item of productos) {
            const subtotal = item.cantidad * item.precio;
            
            if (item.tipo === 'COMBO') {
                await client.query(
                    `INSERT INTO "DetalleVentas" ("IdVenta", "IdCombo", "Cantidad", "PrecioUnitario", "Subtotal") VALUES ($1, $2, $3, $4, $5)`,
                    [idVenta, item.id, item.cantidad, item.precio, subtotal]
                );
                const recetaRes = await client.query(
                    `SELECT "IdArticulo", "Cantidad" FROM "DetalleCombos" WHERE "IdCombo" = $1`,
                    [item.id]
                );
                for (const ing of recetaRes.rows) {
                    await client.query(
                        `UPDATE "Articulos" SET "StockActual" = "StockActual" - $1 WHERE "IdArticulo" = $2`,
                        [item.cantidad * ing.Cantidad, ing.IdArticulo]
                    );
                }

            } else {
                await client.query(
                    `INSERT INTO "DetalleVentas" ("IdVenta", "IdArticulo", "Cantidad", "PrecioUnitario", "Subtotal") VALUES ($1, $2, $3, $4, $5)`,
                    [idVenta, item.id, item.cantidad, item.precio, subtotal]
                );
                await client.query(
                    `UPDATE "Articulos" SET "StockActual" = "StockActual" - $1 WHERE "IdArticulo" = $2`,
                    [item.cantidad, item.id]
                );
            }
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Venta registrada', idVenta });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en venta:', error);
        res.status(500).json({ message: 'Error al procesar la venta' });
    } finally {
        client.release();
    }
};