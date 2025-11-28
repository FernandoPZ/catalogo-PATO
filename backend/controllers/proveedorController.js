// backend/controllers/proveedorController.js
const { pool } = require('../config/db');

// 1. OBTENER TODOS LOS PROVEEDORES (Solo los activos)
exports.getProveedores = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
        'SELECT "IdProveedor", "NomProveedor", "RFC" FROM "Proveedores" WHERE "BajaLogica" IS NOT TRUE ORDER BY "NomProveedor" ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ msg: 'Error interno al obtener proveedores.' });
  } finally {
    client.release();
  }
};

// 2. OBTENER UN PROVEEDOR POR ID
exports.getProveedorById = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT "IdProveedor", "NomProveedor", "RFC" FROM "Proveedores" WHERE "IdProveedor" = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Proveedor no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener proveedor:', error);
        res.status(500).json({ msg: 'Error interno.' });
    } finally {
        client.release();
    }
};

// 3. CREAR PROVEEDOR (Con Auditoría)
exports.createProveedor = async (req, res) => {
  const { NomProveedor, RFC } = req.body;
  // OJO: Asegúrate que tu middleware 'protect' llena req.user
  const idUsuarioLogueado = req.user.IdUsuario; 

  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO "Proveedores" 
      ("NomProveedor", "RFC", "BajaLogica", "IdUsuarioCreacion", "FechaCreacion") 
      VALUES ($1, $2, FALSE, $3, NOW()) 
      RETURNING *
    `;
    
    const result = await client.query(query, [
        NomProveedor, 
        RFC, 
        idUsuarioLogueado
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ msg: 'Error interno al crear proveedor.' });
  } finally {
    client.release();
  }
};

// 4. EDITAR PROVEEDOR (CORREGIDO)
exports.updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { NomProveedor, RFC } = req.body;
  const idUsuarioLogueado = req.user.IdUsuario; // Auditoría

  const client = await pool.connect();
  try {
    // Usamos la variable query correctamente
    const query = `
      UPDATE "Proveedores" 
      SET 
        "NomProveedor" = $1, 
        "RFC" = $2,
        "IdUsuarioModificacion" = $3,
        "FechaModificacion" = NOW()
      WHERE "IdProveedor" = $4
      RETURNING *
    `;
    
    // Pasamos los 4 parámetros en orden: Nom, RFC, IdUser, IdProv
    const result = await client.query(query, [NomProveedor, RFC, idUsuarioLogueado, id]);
    
    if (result.rowCount === 0) {
        return res.status(404).json({ msg: 'Proveedor no encontrado' });
    }

    res.json({ msg: 'Proveedor actualizado.', proveedor: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ msg: 'Error interno al actualizar proveedor.' });
  } finally {
    client.release();
  }
};

// 5. ELIMINAR PROVEEDOR (Baja lógica)
exports.deleteProveedor = async (req, res) => {
  const { id } = req.params;
  // Opcional: Podrías guardar también quién lo eliminó aquí
  // const idUsuarioLogueado = req.user.IdUsuario;

  const client = await pool.connect();
  try {
    await client.query(
      'UPDATE "Proveedores" SET "BajaLogica" = TRUE WHERE "IdProveedor" = $1',
      [id]
    );
    res.json({ msg: 'Proveedor eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ msg: 'Error interno al eliminar proveedor.' });
  } finally {
    client.release();
  }
};
