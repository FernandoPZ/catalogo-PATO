<template>
    <div class="container py-4 minimal-bg">
        <h3 class="fw-bold mb-4"><i class="fa-solid fa-list-check me-2"></i>Bitácora de Actividades</h3>
        <div class="card border-0 shadow-sm minimal-card">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">Fecha/Hora</th>
                                <th>Usuario</th>
                                <th>Acción</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="log in logs" :key="log.id">
                                <td class="ps-4 text-muted small">
                                    {{ new Date(log.fecha).toLocaleString() }}
                                </td>
                                <td>
                                    <span class="fw-bold text-primary">{{ log.Usuario }}</span>
                                    <br>
                                    <span class="badge bg-light text-dark border" style="font-size: 0.7rem;">
                                        {{ log.Rol || 'N/A' }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge" :class="getBadgeClass(log.accion)">
                                        {{ log.accion }}
                                    </span>
                                </td>
                                <td class="text-secondary small">{{ log.detalles }}</td>
                            </tr>
                            <tr v-if="logs.length === 0">
                                <td colspan="4" class="text-center py-5 text-muted">
                                    <i class="fa-solid fa-inbox fa-2x mb-3 d-block"></i>
                                    No hay actividad registrada aún.
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
import bitacoraService from '@/services/bitacoraService';

const logs = ref([]);

onMounted(async () => {
    try {
        logs.value = await bitacoraService.getLogs();
    } catch (error) {
        console.error("Error cargando bitácora", error);
    }
});

const getBadgeClass = (accion) => {
    if (!accion) return 'bg-secondary';
    const acc = accion.toUpperCase();
    if (acc.includes('LOGIN')) return 'bg-success'; // Verde
    if (acc.includes('CREAR') || acc.includes('VENTA')) return 'bg-primary'; // Azul
    if (acc.includes('EDITAR') || acc.includes('MODIFICAR')) return 'bg-warning text-dark'; // Amarillo
    if (acc.includes('ELIMINAR') || acc.includes('BAJA')) return 'bg-danger'; // Rojo
    return 'bg-secondary'; // Gris por defecto
};
</script>

<style scoped>
.minimal-bg { background-color: #f8f9fa; min-height: 100vh; }
.minimal-card { border-radius: 12px; overflow: hidden; }
</style>