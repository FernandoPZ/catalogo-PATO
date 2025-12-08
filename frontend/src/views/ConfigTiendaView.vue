<template>
    <div class="container py-4 minimal-bg">
        <h3 class="fw-bold mb-4"><i class="fa-solid fa-gear me-2"></i>Configuración de la Tienda</h3>
        
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card border-0 shadow-sm minimal-card">
                    <div class="card-body p-4">
                        <form @submit.prevent="guardar">
                            <h5 class="fw-bold text-primary mb-3">Información del Ticket</h5>
                            
                            <div class="mb-3">
                                <label class="form-label fw-bold small">Nombre de la Tienda</label>
                                <input v-model="form.NombreTienda" type="text" class="form-control minimal-input" required>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold small">Teléfono / WhatsApp</label>
                                    <input v-model="form.Telefono" type="text" class="form-control minimal-input">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold small">Red Social (Instagram/Facebook)</label>
                                    <input v-model="form.RedSocial" type="text" class="form-control minimal-input" placeholder="@usuario">
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold small">Dirección Física (Aparece en cabecera)</label>
                                <textarea v-model="form.Direccion" class="form-control minimal-input" rows="2"></textarea>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-bold small">Mensaje de Despedida (Pie de página)</label>
                                <input v-model="form.MensajeTicket" type="text" class="form-control minimal-input">
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary fw-bold minimal-btn" :disabled="loading">
                                    {{ loading ? 'Guardando...' : 'Actualizar Información' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import configService from '@/services/configService';

const loading = ref(false);
const form = reactive({
    NombreTienda: '',
    Direccion: '',
    Telefono: '',
    MensajeTicket: '',
    RedSocial: ''
});

onMounted(async () => {
    try {
        const data = await configService.getConfig();
        Object.assign(form, data);
    } catch (error) {
        console.error("Error al cargar config", error);
    }
});

const guardar = async () => {
    loading.value = true;
    try {
        await configService.updateConfig(form);
        alert("¡Configuración actualizada correctamente!");
    } catch (error) {
        alert("Error al guardar");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.minimal-input { border-radius: 8px; border: 1px solid #dee2e6; padding: 10px; }
</style>