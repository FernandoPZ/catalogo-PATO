<template>
    <div class="container py-4 minimal-bg">
        <h3 class="fw-bold mb-4 text-danger">
            <i class="fa-solid fa-truck-ramp-box me-2"></i>Historial de Compras
        </h3>

        <div class="card border-0 shadow-sm minimal-card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light text-danger bg-opacity-10">
                            <tr>
                                <th class="ps-4">ID Entrada</th>
                                <th>Fecha</th>
                                <th>Proveedor</th>
                                <th>Recibió (Usuario)</th>
                                <th class="text-end pe-4">Costo Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="compra in compras" :key="compra.IdEntrada">
                                <td class="ps-4 text-muted fw-bold">E-{{ compra.IdEntrada }}</td>
                                <td>
                                    <div class="d-flex flex-column">
                                        <span class="fw-bold">{{ formatearFecha(compra.Fecha) }}</span>
                                        <small class="text-muted">{{ formatearHora(compra.Fecha) }}</small>
                                    </div>
                                </td>
                                <td>
                                    <span class="fw-bold text-dark">{{ compra.NomProveedor }}</span>
                                </td>
                                <td>
                                    <small class="text-muted">{{ compra.Usuario || 'Sistema' }}</small>
                                </td>
                                <td class="text-end pe-4 fw-bold text-danger">
                                    - ${{ Number(compra.Total).toFixed(2) }}
                                </td>
                            </tr>
                            <tr v-if="compras.length === 0">
                                <td colspan="5" class="text-center py-5 text-muted">
                                    No hay compras registradas.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import entradaService from '@/services/entradaService';

const compras = ref([]);

onMounted(async () => {
    try {
        compras.value = await entradaService.getEntradas();
    } catch (error) {
        console.error("Error cargando historial de compras", error);
    }
});

const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};
const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
};
</script>