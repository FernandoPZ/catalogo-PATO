<template>
    <div class="container py-4 minimal-bg">
        <div class="row g-4">
            <div class="col-12 col-lg-7 mx-auto">
                <h1 class="mb-4 fw-semibold text-center">{{ isEditing ? 'Editar Artículo' : 'Crear Nuevo Artículo' }}</h1>
                <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>
                <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
                <div v-if="loading" class="alert alert-info">Cargando datos...</div>
                <div class="card border-0 shadow-sm minimal-card" :class="{ 'opacity-50': isSaving || loading }">
                    <div class="card-body">
                        <form @submit.prevent="handleSubmit" class="row g-3">
                            <div v-if="isEditing" class="col-12">
                                <label class="form-label">ID Artículo</label>
                                <input type="text" :value="form.IdArticulo" class="form-control minimal-input" disabled>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="codigo" class="form-label">Código del Artículo</label>
                                <input type="text" id="codigo" v-model="form.CodArticulo" class="form-control minimal-input" required>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="nombre" class="form-label">Nombre del Artículo</label>
                                <input type="text" id="nombre" v-model="form.NomArticulo" class="form-control minimal-input" required>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="proveedor" class="form-label">Proveedor</label>
                                <select id="proveedor" v-model="form.IdProveedor" class="form-select minimal-input" required>
                                    <option value="" disabled>Selecciona un proveedor</option>
                                    <option v-for="prov in proveedores" :key="prov.IdProveedor" :value="prov.IdProveedor">
                                        {{ prov.NomProveedor }} ({{ prov.RFC }})
                                    </option>
                                </select>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="precio" class="form-label text-success fw-bold">Precio de Venta ($)</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white text-success border-end-0 fw-bold">$</span>
                                    <input 
                                        type="number" 
                                        id="precio" 
                                        v-model.number="form.PrecioVenta" 
                                        class="form-control minimal-input border-start-0" 
                                        step="0.50" 
                                        min="0" 
                                        placeholder="0.00"
                                        required
                                    >
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="unidad" class="form-label">Unidad de Medida (Nombre)</label>
                                <input type="text" id="unidad" v-model="form.NombreUnidad" class="form-control minimal-input" required>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="minimo" class="form-label">Stock Mínimo (Alerta)</label>
                                <input type="number" id="minimo" v-model.number="form.CantidadMinima" class="form-control minimal-input" required min="0">
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="maximo" class="form-label">Stock Máximo (Límite)</label>
                                <input type="number" id="maximo" v-model.number="form.CantidadMaxima" class="form-control minimal-input" required min="0">
                            </div>
                            <div class="col-12 d-flex justify-content-between mt-4">
                                <button type="button" @click="$router.push({ name: 'Articulos' })" class="btn btn-secondary minimal-btn">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn btn-dark minimal-btn" :disabled="isSaving">
                                    <span v-if="isSaving">Guardando...</span>
                                    <span v-else>{{ isEditing ? 'Guardar Cambios' : 'Crear Artículo' }}</span>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import articuloService from '@/services/articuloService';
import { getProveedores } from '@/services/proveedorService';

const route = useRoute();
const router = useRouter();
const isEditing = computed(() => !!route.params.id);
const itemId = computed(() => route.params.id);
const form = reactive({
    IdArticulo: null,
    NomArticulo: '', 
    CodArticulo: '',
    PrecioVenta: 0,
    StockActual: 0, 
    IdProveedor: '',      
    CantidadMinima: 0,
    CantidadMaxima: 0,
    NombreUnidad: '', 
});
const proveedores = ref([]);
const loading = ref(false);
const isSaving = ref(false);
const errorMsg = ref(null);
const successMsg = ref(null);
const loadItem = async () => {
    loading.value = true;
    errorMsg.value = null;
    try {
        const item = await articuloService.getArticuloById(itemId.value);
        form.IdArticulo = item.IdArticulo;
        form.NomArticulo = item.NomArticulo;
        form.StockActual = item.StockActual;
        form.PrecioVenta = Number(item.PrecioVenta);
        form.CodArticulo = item.CodArticulo;
        form.IdProveedor = item.IdProveedor;
        form.CantidadMinima = item.CantidadMinima;
        form.CantidadMaxima = item.CantidadMaxima;
        form.NombreUnidad = item.NombreUnidad;
    } catch (err) {
        errorMsg.value = "Error al cargar el artículo. Puede que no exista o que la sesión haya expirado.";
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const handleSubmit = async () => {
    isSaving.value = true;
    errorMsg.value = null;
    successMsg.value = null;

    try {
        let response;
        const dataToSend = {
            NomArticulo: form.NomArticulo,
            CodArticulo: form.CodArticulo, 
            IdProveedor: form.IdProveedor,
            PrecioVenta: form.PrecioVenta,
            CantidadMinima: form.CantidadMinima,
            CantidadMaxima: form.CantidadMaxima,
            NombreUnidad: form.NombreUnidad
        };

        if (isEditing.value) {
            response = await articuloService.updateArticulo(itemId.value, dataToSend);
            successMsg.value = `Artículo actualizado exitosamente.`;
            setTimeout(loadItem, 1000); 
        } else {
            response = await articuloService.createArticulo(dataToSend);
            successMsg.value = `Artículo creado con ID ${response.IdArticulo}.`;
            setTimeout(() => {
                router.push({ name: 'Articulos' });
            }, 1500);
        }

    } catch (err) {
        errorMsg.value = err.response?.data?.msg || 'Error desconocido al procesar la solicitud.';
        console.error("Error en el formulario:", err);
    } finally {
        isSaving.value = false;
    }
};

onMounted(async () => {
    try {
        proveedores.value = await getProveedores();
    } catch (err) {
        errorMsg.value = 'Error al cargar proveedores.';
    }
    if (isEditing.value) {
        loadItem();
    }
});
</script>

<style scoped>
.opacity-50 {
    opacity: 0.5;
    pointer-events: none;
}
</style>