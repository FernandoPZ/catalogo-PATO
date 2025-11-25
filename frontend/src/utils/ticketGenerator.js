import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarTicketPDF = (ventaId, usuarioNombre, carrito, total) => {
    // 1. Configuración del documento (Tamaño ticket 80mm x variable)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // Ancho 80mm, Alto 200mm (ajustable)
    });

    const centerX = 40; // Mitad de 80mm

    // 2. Encabezado
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TIENDA EL PATO", centerX, 10, { align: "center" });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Calle Falsa 123, Centro", centerX, 14, { align: "center" });
    doc.text("Tel: 555-0000", centerX, 18, { align: "center" });
    doc.text("--------------------------------", centerX, 22, { align: "center" });

    // 3. Datos de la Venta
    doc.text(`Folio: #${ventaId}`, 5, 28);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 5, 32);
    doc.text(`Hora: ${new Date().toLocaleTimeString()}`, 45, 32);
    doc.text(`Le atendió: ${usuarioNombre}`, 5, 36);

    // 4. Tabla de Productos
    const columnas = ["Cant", "Prod", "Importe"];
    const filas = carrito.map(item => [
        item.cantidad,
        item.NomArticulo, // Nombre corto si es muy largo
        `$${(item.cantidad * item.precio).toFixed(2)}`
    ]);

    autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 40,
        theme: 'plain', // Sin colores para ahorrar tinta
        styles: { fontSize: 8, cellPadding: 1, overflow: 'linebreak' },
        headStyles: { fontStyle: 'bold' },
        columnStyles: {
            0: { cellWidth: 10 }, // Cantidad pequeña
            1: { cellWidth: 'auto' }, // Nombre adaptable
            2: { cellWidth: 20, halign: 'right' } // Precio a la derecha
        },
        margin: { left: 5, right: 5 }
    });

    // 5. Totales (Obtenemos la posición final de la tabla)
    const finalY = doc.lastAutoTable.finalY + 5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${total.toFixed(2)}`, 75, finalY, { align: "right" });

    // 6. Pie de página
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("¡Gracias por su compra!", centerX, finalY + 10, { align: "center" });
    doc.text("********", centerX, finalY + 14, { align: "center" });

    // 7. Descargar (o abrir en nueva pestaña)
    doc.save(`Ticket_Venta_${ventaId}.pdf`);
    
    // Si tienes impresora conectada y quieres que se abra el diálogo de imprimir:
    // doc.autoPrint();
    // window.open(doc.output('bloburl'), '_blank');
};