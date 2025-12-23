<template>
    <div class="container py-4 minimal-bg">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold mb-0 text-danger">
                <i class="fa-solid fa-truck-ramp-box me-2"></i>Historial de Compras
            </h3>
            <router-link to="/entradas/nueva" class="btn btn-danger shadow-sm minimal-btn">
                <i class="fa-solid fa-plus me-2"></i>Registrar Entrada
            </router-link>
        </div>
        <div class="card border-0 shadow-sm minimal-card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light text-danger bg-opacity-10">
                            <tr>
                                <th class="ps-4">ID Entrada</th>
                                <th>Fecha</th>
                                <th>Proveedor</th>
                                <th>Recibió</th>
                                <th>Comentarios</th> <th class="text-end">Costo Total</th>
                                <th class="text-center pe-4">Detalles</th> </tr>
                        </thead>
                        <tbody>
                            <tr v-for="compra in compras" :key="compra.IdEntrada">
                                <td class="ps-4 text-muted fw-bold">#{{ compra.IdEntrada }}</td>
                                <td>
                                    <div class="d-flex flex-column">
                                        <span class="fw-bold">{{ formatearFecha(compra.Fecha) }}</span>
                                        <small class="text-muted" style="font-size: 0.75rem;">{{ formatearHora(compra.Fecha) }}</small>
                                    </div>
                                </td>
                                <td>
                                    <span class="fw-bold text-dark">{{ compra.NomProveedor }}</span><br>
                                    <small class="text-muted" style="font-size: 0.75rem;">{{ compra.RFC || 'Sin RFC' }}</small>
                                </td>
                                <td>
                                    <span class="badge bg-light text-dark border">{{ compra.Usuario || 'Sistema' }}</span>
                                </td>
                                <td class="text-muted small text-truncate" style="max-width: 150px;">
                                    {{ compra.Comentarios || '-' }}
                                </td>
                                <td class="text-end fw-bold text-danger">
                                    - ${{ Number(compra.Total).toFixed(2) }}
                                </td>
                                <td class="text-center pe-4">
                                    <button class="btn btn-sm btn-outline-danger border-0 bg-light" @click="abrirDetalle(compra)">
                                        <i class="fa-regular fa-eye"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="compras.length === 0">
                                <td colspan="7" class="text-center py-5 text-muted">
                                    No hay compras registradas.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="modal fade" id="modalDetalle" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold text-danger">
                            Detalle de Compra #{{ detalleSeleccionado?.IdEntrada }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-light border d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <small class="text-muted d-block text-uppercase" style="font-size: 0.7rem;">Proveedor</small>
                                <strong class="text-dark">{{ detalleSeleccionado?.NomProveedor }}</strong>
                            </div>
                            <div class="text-end">
                                <small class="text-muted d-block text-uppercase" style="font-size: 0.7rem;">Fecha Registro</small>
                                <strong>{{ detalleSeleccionado ? formatearFecha(detalleSeleccionado.Fecha) : '' }}</strong>
                            </div>
                        </div>
                        <div class="table-responsive border rounded">
                            <table class="table table-sm mb-0 align-middle">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="ps-3">Producto / Variante</th>
                                        <th class="text-center">Cant.</th>
                                        <th class="text-end">Costo U.</th>
                                        <th class="text-end pe-3">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, idx) in productosDetalle" :key="idx">
                                        <td class="ps-3">
                                            <span class="fw-medium">{{ item.NomArticulo }}</span>
                                            <div class="d-flex gap-1 mt-1">
                                                <span v-if="item.Talla" class="badge bg-light text-dark border px-1" style="font-size: 0.65rem;">{{ item.Talla }}</span>
                                                <span v-if="item.Color" class="badge border px-1" :style="getBadgeStyle(item.Color)" style="font-size: 0.65rem;">{{ item.Color }}</span>
                                            </div>
                                        </td>
                                        <td class="text-center fw-bold">{{ item.Cantidad }}</td>
                                        <td class="text-end text-muted">${{ Number(item.CostoUnitario).toFixed(2) }}</td>
                                        <td class="text-end pe-3 fw-bold text-dark">${{ Number(item.Subtotal || (item.Cantidad * item.CostoUnitario)).toFixed(2) }}</td>
                                    </tr>
                                </tbody>
                                <tfoot class="border-top">
                                    <tr>
                                        <td colspan="3" class="text-end pt-3 text-muted">TOTAL PAGADO:</td>
                                        <td class="text-end pt-3 pe-3"><strong class="fs-5 text-danger">${{ Number(detalleSeleccionado?.Total).toFixed(2) }}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import entradaService from '@/services/entradaService';
import { Modal } from 'bootstrap';

const compras = ref([]);
const productosDetalle = ref([]);
const detalleSeleccionado = ref(null);
let modalInstance = null;

onMounted(async () => {
    try {
        compras.value = await entradaService.getEntradas();
        const modalEl = document.getElementById('modalDetalle');
        if (modalEl) {
            modalInstance = new Modal(modalEl);
        }
    } catch (error) {
        console.error("Error cargando historial de compras", error);
    }
});

const abrirDetalle = async (compra) => {
    detalleSeleccionado.value = compra;
    productosDetalle.value = [];
    modalInstance.show();
    try {
        productosDetalle.value = await entradaService.getDetalleEntrada(compra.IdEntrada);
    } catch (error) {
        console.error("Error al cargar detalles", error);
    }
};

const formatearFecha = (fecha) => {
    if(!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};
const formatearHora = (fecha) => {
    if(!fecha) return '';
    return new Date(fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
};

const getBadgeStyle = (nombreColor) => {
    const colores = {
        'negro': '#212529', 'blanco': '#f8f9fa', 'rojo': '#dc3545',
        'azul': '#0d6efd', 'verde': '#198754', 'amarillo': '#ffc107',
        'rosa': '#d63384', 'gris': '#6c757d', 'naranja': '#fd7e14', 'morado': '#6f42c1'
    };
    const bg = colores[nombreColor?.toLowerCase()] || '#e9ecef';
    const isDark = ['negro', 'azul', 'rojo', 'verde', 'morado', 'gris'].includes(nombreColor?.toLowerCase());
    return { backgroundColor: bg, color: isDark ? 'white' : '#212529', borderColor: '#dee2e6' };
};
</script>

<style scoped>
.minimal-bg { background-color: #f8f9fa; min-height: 100vh; }
.minimal-card { border-radius: 12px; overflow: hidden; }
.minimal-btn { border-radius: 8px; font-weight: 500; }
</style>