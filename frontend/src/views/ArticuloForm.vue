<template>
    <div class="container py-4 minimal-bg">
        <div class="row g-4">
            <div class="col-12 col-lg-8 mx-auto">
                <h2 class="mb-4 fw-bold text-center text-dark">
                    <i class="fa-solid" :class="isEditing ? 'fa-pen-to-square' : 'fa-box-open'"></i>
                    {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
                </h2>
                <div v-if="successMsg" class="alert alert-success shadow-sm border-0">{{ successMsg }}</div>
                <div v-if="errorMsg" class="alert alert-danger shadow-sm border-0">{{ errorMsg }}</div>
                <div v-if="loading" class="alert alert-info shadow-sm border-0">Cargando datos...</div>
                <div class="card border-0 shadow-sm minimal-card" :class="{ 'opacity-50': isSaving || loading }">
                    <div class="card-body p-4">
                        <form @submit.prevent="handleSubmit" class="row g-3">
                            <div class="col-12">
                                <h6 class="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Datos Generales</h6>
                            </div>
                            <div class="col-12 col-md-6">
                                <label class="form-label fw-medium">Categoría del Producto</label>
                                <select v-model="form.Categoria" class="form-select minimal-input bg-light">
                                    <option value="GENERAL">General</option>
                                    <option value="TEXTIL">Textil (Playeras, Sudaderas)</option>
                                    <option value="TAZAS">Tazas y Cerámica</option>
                                    <option value="INSUMOS">Insumos (Vinil, Tintas)</option>
                                    <option value="GORRAS">Gorras / Sombreros</option>
                                </select>
                            </div>
                            <div class="col-12 col-md-6">
                                <label class="form-label fw-medium">Código (SKU)</label>
                                <input type="text" v-model="form.CodArticulo" class="form-control minimal-input" placeholder="Ej. PLAY-NEG-M">
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-medium">Nombre del Artículo</label>
                                <input type="text" v-model="form.NomArticulo" class="form-control minimal-input" required placeholder="Ej. Playera Cuello Redondo Peso Completo">
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-medium">Marca / Detalles Técnicos</label>
                                <input type="text" v-model="form.DetallesTecnicos" class="form-control minimal-input" placeholder="Ej. Marca Yazbek, Algodón 100%, Cerámica Importada...">
                            </div>
                            <div class="col-12 col-md-6">
                                <label class="form-label fw-medium">Proveedor</label>
                                <select v-model="form.IdProveedor" class="form-select minimal-input" required>
                                    <option value="" disabled>Selecciona un proveedor</option>
                                    <option v-for="prov in proveedores" :key="prov.IdProveedor" :value="prov.IdProveedor">
                                        {{ prov.NomProveedor }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-12 mt-4">
                                <h6 class="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Características (Variantes)</h6>
                            </div>
                            <div class="col-6 col-md-4">
                                <label class="form-label fw-medium">Talla</label>
                                <select v-model="form.Talla" class="form-select minimal-input">
                                    <option value="">N/A (Única)</option>
                                    <option value="CH">CH (Chica)</option>
                                    <option value="M">M (Mediana)</option>
                                    <option value="G">G (Grande)</option>
                                    <option value="XL">XL (Extra G)</option>
                                    <option value="XXL">XXL (Doble G)</option>
                                    <option value="JUV">Juvenil</option>
                                    <option value="INF">Infantil</option>
                                    <option value="BB">Bebé</option>
                                </select>
                            </div>
                            <div class="col-6 col-md-4">
                                <label class="form-label fw-medium">Color</label>
                                <select v-model="form.Color" class="form-select minimal-input">
                                    <option value="">Sin Color</option>
                                    <option value="Blanco">Blanco</option>
                                    <option value="Negro">Negro</option>
                                    <option value="Rojo">Rojo</option>
                                    <option value="Azul">Azul</option>
                                    <option value="Marino">Azul Marino</option>
                                    <option value="Verde">Verde</option>
                                    <option value="Amarillo">Amarillo</option>
                                    <option value="Rosa">Rosa</option>
                                    <option value="Gris">Gris</option>
                                    <option value="Naranja">Naranja</option>
                                    <option value="Morado">Morado</option>
                                </select>
                            </div>
                            <div class="col-12 col-md-4">
                                <label class="form-label fw-medium">Unidad Medida</label>
                                <input type="text" v-model="form.NombreUnidad" class="form-control minimal-input" placeholder="Pza, Kg, Paq">
                            </div>
                            <div class="col-12 mt-4">
                                <h6 class="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Inventario y Costos</h6>
                            </div>
                            <div class="col-12 col-md-6">
                                <label class="form-label text-success fw-bold">Precio Venta ($)</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-success text-white border-0">$</span>
                                    <input type="number" v-model.number="form.PrecioVenta" class="form-control minimal-input" step="0.50" min="0" required>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label class="form-label fw-bold">Stock Actual</label>
                                <input 
                                    type="number" 
                                    v-model.number="form.StockActual" 
                                    class="form-control minimal-input bg-light" 
                                    disabled
                                >
                                <div class="form-text text-muted small">
                                    <i class="fa-solid fa-lock"></i> 
                                    Gestionar desde "Entradas/Compras".
                                </div>
                            </div>
                            <div class="col-6">
                                <label class="form-label small text-muted">Stock Mínimo (Alerta)</label>
                                <input type="number" v-model.number="form.CantidadMinima" class="form-control minimal-input" min="0">
                            </div>
                            <div class="col-6">
                                <label class="form-label small text-muted">Stock Máximo</label>
                                <input type="number" v-model.number="form.CantidadMaxima" class="form-control minimal-input" min="0">
                            </div>
                            <div class="col-12 d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                <button type="button" @click="$router.push({ name: 'Articulos' })" class="btn btn-light border minimal-btn px-4">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn btn-dark minimal-btn px-4 shadow-sm" :disabled="isSaving">
                                    <i class="fa-solid fa-save me-2"></i>
                                    <span v-if="isSaving">Guardando...</span>
                                    <span v-else>{{ isEditing ? 'Guardar Cambios' : 'Registrar Artículo' }}</span>
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
    CantidadMinima: 5,
    CantidadMaxima: 100,
    NombreUnidad: 'Pza',
    Categoria: 'GENERAL',
    Talla: '',
    Color: '',
    DetallesTecnicos: ''
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
        form.NombreUnidad = item.NombreUnidad || 'Pza';
        form.Categoria = item.Categoria || 'GENERAL';
        form.Talla = item.Talla || '';
        form.Color = item.Color || '';
        form.DetallesTecnicos = item.DetallesTecnicos || '';
    } catch (err) {
        errorMsg.value = "Error al cargar el artículo.";
        console.error(err);
    } finally {
        loading.value = false;
    }
};
// GUARDAR
const handleSubmit = async () => {
    isSaving.value = true;
    errorMsg.value = null;
    successMsg.value = null;
    try {
        const dataToSend = {
            NomArticulo: form.NomArticulo,
            CodArticulo: form.CodArticulo, 
            IdProveedor: form.IdProveedor,
            PrecioVenta: form.PrecioVenta,
            CantidadMinima: form.CantidadMinima,
            CantidadMaxima: form.CantidadMaxima,
            NombreUnidad: form.NombreUnidad,
            Categoria: form.Categoria,
            Talla: form.Talla,
            Color: form.Color,
            DetallesTecnicos: form.DetallesTecnicos,
            StockActual: form.StockActual 
        };
        if (isEditing.value) {
            await articuloService.updateArticulo(itemId.value, dataToSend);
            successMsg.value = `Artículo actualizado exitosamente.`;
            setTimeout(() => router.push({ name: 'Articulos' }), 1000); 
        } else {
            const response = await articuloService.createArticulo(dataToSend);
            successMsg.value = `Artículo creado con éxito.`;
            setTimeout(() => router.push({ name: 'Articulos' }), 1000);
        }
    } catch (err) {
        errorMsg.value = err.response?.data?.msg || 'Error al guardar.';
        console.error(err);
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
.opacity-50 { opacity: 0.5; pointer-events: none; }
.minimal-bg { background-color: #f8f9fa; min-height: 100vh; }
.minimal-card { border-radius: 12px; overflow: hidden; }
.minimal-input { border-radius: 8px; padding: 10px 12px; border: 1px solid #dee2e6; }
.minimal-input:focus { border-color: #212529; box-shadow: 0 0 0 0.2rem rgba(33, 37, 41, 0.1); }
.minimal-btn { border-radius: 8px; font-weight: 500; transition: all 0.2s; }
.minimal-btn:hover { transform: translateY(-1px); }
</style>