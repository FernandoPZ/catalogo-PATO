const express = require('express');
const router = express.Router();
const db = require('../config/db');

// OBTENER HISTORIAL (Sin cambios)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT v."IdVenta", v."Fecha", v."Total", v."Estado", u."Nombre" as "Vendedor"
            FROM "Ventas" v
            LEFT JOIN "Usuario" u ON v."IdUsuario" = u."IdUsuario"
            ORDER BY v."Fecha" DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener ventas' });
    }
});

// CREAR VENTA (¡Lógica Mejorada para Combos!)
router.post('/', async (req, res) => {
    const client = await db.pool.connect();
    
    try {
        // Ahora esperamos que cada producto tenga una propiedad 'tipo': 'ARTICULO' o 'COMBO'
        const { idUsuario, total, productos } = req.body; 

        await client.query('BEGIN'); // Iniciar transacción

        // 1. INSERTAR EL TICKET GENERAL
        const ventaQuery = `
            INSERT INTO "Ventas" ("IdUsuario", "Total", "Fecha")
            VALUES ($1, $2, NOW())
            RETURNING "IdVenta";
        `;
        const ventaResult = await client.query(ventaQuery, [idUsuario, total]);
        const idVenta = ventaResult.rows[0].IdVenta;

        // 2. PROCESAR CADA ITEM DEL CARRITO
        for (const item of productos) {
            
            // Calculamos subtotal
            const subtotal = item.cantidad * item.precio;

            if (item.tipo === 'COMBO') {
                // === LÓGICA DE COMBO ===
                
                // A. Guardar que se vendió un Combo en el ticket
                const detalleComboQuery = `
                    INSERT INTO "DetalleVentas" ("IdVenta", "IdCombo", "Cantidad", "PrecioUnitario", "Subtotal")
                    VALUES ($1, $2, $3, $4, $5)
                `;
                await client.query(detalleComboQuery, [idVenta, item.id, item.cantidad, item.precio, subtotal]);

                // B. Buscar la "Receta" (qué artículos lleva este combo)
                const recetaQuery = `SELECT "IdArticulo", "Cantidad" FROM "DetalleCombos" WHERE "IdCombo" = $1`;
                const recetaResult = await client.query(recetaQuery, [item.id]);

                // C. Restar stock de los ingredientes
                for (const ingrediente of recetaResult.rows) {
                    // Cantidad a restar = (Cantidad del Combo en ticket) * (Cantidad que lleva la receta)
                    const cantidadARestar = item.cantidad * ingrediente.Cantidad;

                    const stockQuery = `
                        UPDATE "Articulos"
                        SET "StockActual" = "StockActual" - $1
                        WHERE "IdArticulo" = $2
                    `;
                    await client.query(stockQuery, [cantidadARestar, ingrediente.IdArticulo]);
                }

            } else {
                // === LÓGICA DE ARTÍCULO NORMAL ===
                
                // A. Guardar detalle normal
                const detalleQuery = `
                    INSERT INTO "DetalleVentas" ("IdVenta", "IdArticulo", "Cantidad", "PrecioUnitario", "Subtotal")
                    VALUES ($1, $2, $3, $4, $5)
                `;
                await client.query(detalleQuery, [idVenta, item.id, item.cantidad, item.precio, subtotal]);

                // B. Restar Stock directo
                const stockQuery = `
                    UPDATE "Articulos"
                    SET "StockActual" = "StockActual" - $1
                    WHERE "IdArticulo" = $2
                `;
                await client.query(stockQuery, [item.cantidad, item.id]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Venta registrada con éxito', idVenta });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en venta:', error);
        res.status(500).json({ message: 'Error al procesar la venta' });
    } finally {
        client.release();
    }
});

module.exports = router;