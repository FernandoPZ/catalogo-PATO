exports.getVentaDetalles = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        const query = `
            SELECT 
                dv."Cantidad",
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