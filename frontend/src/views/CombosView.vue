<template>
    <div class="container py-4 minimal-bg">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold"><i class="fa-solid fa-boxes-packing me-2"></i>Catálogo de Kits</h3>
            <router-link to="/kits/nuevo" class="btn btn-primary minimal-btn">
                + Nuevo Kit
            </router-link>
        </div>
        <div class="row g-4">
            <div v-for="kit in kits" :key="kit.IdCombo" class="col-md-4">
                <div class="card border-0 shadow-sm h-100 minimal-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="fw-bold text-primary">{{ kit.Nombre }}</h5>
                            <span class="badge bg-success">${{ Number(kit.Precio).toFixed(2) }}</span>
                        </div>
                        <p class="text-muted small mb-3">Código: {{ kit.Codigo || 'S/N' }}</p>
                        <div class="d-flex gap-2 mt-3">
                            <router-link :to="`/kits/editar/${kit.IdCombo}`" class="btn btn-sm btn-outline-info w-100">
                                <i class="fas fa-edit"></i> Editar
                            </router-link>
                            <button @click="eliminar(kit)" class="btn btn-sm btn-outline-danger w-100">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             <div v-if="kits.length === 0" class="col-12 text-center text-muted py-5">
                No hay kits registrados.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import comboService from '@/services/comboService';

const kits = ref([]);
const cargar = async () => {
    try {
        kits.value = await comboService.getCombos();
    } catch (error) { console.error(error); }
};
const eliminar = async (kit) => {
    if(confirm(`¿Desactivar el kit "${kit.Nombre}"?`)) {
        await comboService.deleteCombo(kit.IdCombo);
        cargar();
    }
};

onMounted(cargar);
</script>