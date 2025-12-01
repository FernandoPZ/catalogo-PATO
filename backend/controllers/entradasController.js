const { pool } = require('../config/db');

exports.getEntradas = async (req, res) => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT e."IdEntrada", e."Fecha", e."Total", p."NomProveedor", u."Nombre" as "Usuario"
            FROM "Entradas" e
            JOIN "Proveedores" p ON e."IdProveedor" = p."IdProveedor"
            LEFT JOIN "Usuario" u ON e."IdUsuarioCreacion" = u."IdUsuario"
            ORDER BY e."Fecha" DESC
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
exports.createEntrada = async (req, res) => {
    const client = await pool.connect();
    try {
        const { IdProveedor, Total, Productos, Comentarios } = req.body;
        const IdUsuario = req.user.IdUsuario;
        await client.query('BEGIN');
        const entradaQuery = `
            INSERT INTO "Entradas" ("IdProveedor", "Total", "Comentarios", "IdUsuarioCreacion", "Fecha")
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING "IdEntrada"
        `;
        const entradaRes = await client.query(entradaQuery, [IdProveedor, Total, Comentarios, IdUsuario]);
        const IdEntrada = entradaRes.rows[0].IdEntrada;
        for (const prod of Productos) {
            const detalleQuery = `
                INSERT INTO "DetalleEntradas" ("IdEntrada", "IdArticulo", "Cantidad", "CostoUnitario", "Subtotal")
                VALUES ($1, $2, $3, $4, $5)
            `;
            const subtotal = prod.Cantidad * prod.Costo;
            await client.query(detalleQuery, [IdEntrada, prod.IdArticulo, prod.Cantidad, prod.Costo, subtotal]);
            const stockQuery = `
                UPDATE "Articulos"
                SET 
                    "StockActual" = "StockActual" + $1,
                    "FechaModificacion" = NOW(),
                    "IdUsuarioModificacion" = $2
                WHERE "IdArticulo" = $3
            `;
            await client.query(stockQuery, [prod.Cantidad, IdUsuario, prod.IdArticulo]);
        }
        await client.query('COMMIT');
        res.status(201).json({ msg: 'Entrada registrada y stock actualizado', IdEntrada });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ msg: 'Error al procesar entrada' });
    } finally {
        client.release();
    }
};