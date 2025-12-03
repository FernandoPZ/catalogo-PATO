import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const cargarImagen = (src) => {
    return new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.warn("No se pudo cargar una imagen");
            resolve(null);
        };
    });
};

export const generarTicketPDF = async (ventaId, usuarioNombre, carrito, total, logoTopSrc, watermarkSrc, redSocialSrc) => {
    
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200]
    });

    const centerX = 40;
    let yPos = 5;

    const [imgTop, imgWatermark, imgRedSocial] = await Promise.all([
        cargarImagen(logoTopSrc),
        cargarImagen(watermarkSrc),
        cargarImagen(redSocialSrc)
    ]);
    // --- MARCA DE AGUA ---
    if (imgWatermark) {
        try {
            const wAncho = 60; 
            const wAlto = (imgWatermark.height * wAncho) / imgWatermark.width; 
            const wX = (80 - wAncho) / 2;
            doc.setGState(new doc.GState({ opacity: 0.10 }));
            doc.addImage(imgWatermark, 'PNG', wX, 40, wAncho, wAlto);
            doc.setGState(new doc.GState({ opacity: 1.0 }));
        } catch (e) { console.error(e); }
    }
    // --- LOGO CABECERA ---
    if (imgTop) {
        try {
            const lAncho = 30; 
            const lAlto = (imgTop.height * lAncho) / imgTop.width; 
            const lX = (80 - lAncho) / 2;
            doc.addImage(imgTop, 'PNG', lX, yPos, lAncho, lAlto);
            yPos += lAlto + 5; 
        } catch (e) { console.error(e); }
    }

    // --- DATOS SUCURSAL Y REDES ---
    if (!imgTop) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Aura Creativa", centerX, yPos, { align: "center" });
        yPos += 5;
    }
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    
    // LÓGICA DEL INSTAGRAM
    if (imgRedSocial) {
        const iconSize = 4;
        const textoRed = "@aura.sublimados";
        const textWidth = doc.getTextWidth(textoRed);
        const totalWidth = iconSize + 1 + textWidth;
        const startX = (80 - totalWidth) / 2;
        // Dibujar Icono
        doc.addImage(imgRedSocial, 'PNG', startX, yPos - 3, iconSize, iconSize);
        // Dibujar Texto al lado
        doc.text(textoRed, startX + iconSize + 1, yPos);
    } else {
        // Fallback si no carga la imagen
        doc.text("Instagram: @catalogo_pato", centerX, yPos, { align: "center" });
    }
    yPos += 5;
    doc.text("Tel: 771-430-6643", centerX, yPos, { align: "center" });
    yPos += 4;
    doc.text("--------------------------------", centerX, yPos, { align: "center" });
    yPos += 5;
    // --- DATOS VENTA ---
    doc.text(`Folio: #${ventaId}`, 5, yPos);
    yPos += 4;
    doc.text(`Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 5, yPos);
    yPos += 4;
    doc.text(`Le atendió: ${usuarioNombre}`, 5, yPos);
    yPos += 2;
    // --- TABLA ---
    const columnas = ["Cant", "Prod", "P.U.", "Total"];
    const filas = carrito.map(item => [
        item.cantidad,
        item.tipo === 'COMBO' ? `[KIT] ${item.nombre}` : item.nombre || item.NomArticulo,
        `$${Number(item.precio).toFixed(2)}`,
        `$${(item.cantidad * item.precio).toFixed(2)}`
    ]);
    autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: yPos,
        theme: 'plain',
        styles: { fontSize: 7, cellPadding: 1, overflow: 'linebreak' },
        headStyles: { fontStyle: 'bold', halign: 'center' },
        columnStyles: {
            0: { cellWidth: 8, halign: 'center' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 13, halign: 'right' },
            3: { cellWidth: 15, halign: 'right' }
        },
        margin: { left: 4, right: 4 }
    });
    const finalY = doc.lastAutoTable.finalY + 5;
    // --- TOTALES ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${total.toFixed(2)}`, 76, finalY, { align: "right" });
    // --- PIE ---
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("¡Gracias por su compra!", centerX, finalY + 10, { align: "center" });
    doc.text("********", centerX, finalY + 14, { align: "center" });
    doc.save(`Ticket_Venta_${ventaId}.pdf`);
    const pdfBlob = doc.output('bloburl');
    window.open(pdfBlob, '_blank');
};