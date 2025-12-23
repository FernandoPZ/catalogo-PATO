<template>
    <div class="container py-4 minimal-bg">
        <h3 class="fw-bold mb-4"><i class="fa-solid fa-map-location-dot me-2"></i>Puntos de Entrega</h3>
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card border-0 shadow-sm minimal-card">
                    <div class="card-body">
                        <h5 class="fw-bold mb-3">Nuevo Punto</h5>
                        <form @submit.prevent="guardar">
                            <div class="mb-3">
                                <label class="small fw-bold">Nombre del Lugar</label>
                                <input v-model="form.NombrePunto" type="text" class="form-control minimal-input" placeholder="Ej. Metro Centro" required>
                            </div>
                            <div class="mb-3">
                                <label class="small fw-bold">Link de Google Maps</label>
                                <input v-model="form.LinkGoogleMaps" type="url" class="form-control minimal-input" placeholder="https://maps.app.goo.gl/..." required>
                                <small class="text-muted" style="font-size: 0.75rem;">Copia el link de "Compartir" de Google Maps.</small>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 minimal-btn">Agregar</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card border-0 shadow-sm minimal-card">
                    <div class="card-body p-0">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">Nombre</th>
                                    <th>Link</th>
                                    <th class="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="punto in puntos" :key="punto.IdPunto">
                                    <td class="ps-4 fw-bold">{{ punto.NombrePunto }}</td>
                                    <td>
                                        <a :href="punto.LinkGoogleMaps" target="_blank" class="text-decoration-none">
                                            <i class="fa-solid fa-arrow-up-right-from-square small me-1"></i> Ver Mapa
                                        </a>
                                    </td>
                                    <td class="text-end pe-4">
                                        <button @click="eliminar(punto.IdPunto)" class="btn btn-sm btn-outline-danger border-0">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import puntosService from '@/services/puntosEntregaService';

const puntos = ref([]);
const form = reactive({ NombrePunto: '', LinkGoogleMaps: '' });

const cargar = async () => {
    puntos.value = await puntosService.getPuntos();
};

const guardar = async () => {
    await puntosService.createPunto(form);
    form.NombrePunto = '';
    form.LinkGoogleMaps = '';
    cargar();
};

const eliminar = async (id) => {
    if(confirm('¿Eliminar este punto de entrega?')) {
        await puntosService.deletePunto(id);
        cargar();
    }
};

onMounted(cargar);
</script>
<style scoped> .minimal-input { border-radius: 8px; border: 1px solid #dee2e6; } </style>