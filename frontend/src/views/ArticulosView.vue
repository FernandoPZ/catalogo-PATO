<template>
    <div class="container py-4 minimal-bg">
        <div class="row g-4">
            <div class="col-12 mx-auto">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h3 class="fw-semibold mb-0">Mis Insumos y Productos</h3>
                        <small class="text-muted">Total de piezas físicas: {{ totalStock }}</small>
                    </div>
                    <router-link :to="{ name: 'ArticuloNuevo' }" class="btn btn-success minimal-btn shadow-sm">
                        <i class="fa-solid fa-plus me-1"></i> Nuevo Artículo
                    </router-link>
                </div>
                <div v-if="loading" class="alert alert-info border-0 shadow-sm">
                    <i class="fa-solid fa-spinner fa-spin me-2"></i> Cargando inventario...
                </div>
                <div v-else-if="error" class="alert alert-danger border-0 shadow-sm">
                    <i class="fa-solid fa-triangle-exclamation me-2"></i> {{ error }}
                </div>
                <div class="card border-0 shadow-sm minimal-card">
                    <div class="card-body p-0">
                        <div class="table-responsive minimal-table-wrapper">
                            <table class="table table-hover align-middle minimal-table mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="ps-4">Código/ID</th>
                                        <th>Artículo</th> <th>Características</th> <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th class="text-end pe-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="articulo in articulos" :key="articulo.IdArticulo">
                                        <td class="ps-4">
                                            <span class="fw-bold text-dark">{{ articulo.CodArticulo || articulo.IdArticulo }}</span>
                                        </td>
                                        <td>
                                            <div class="d-flex flex-column">
                                                <span class="fw-bold text-primary">{{ articulo.NomArticulo }}</span>
                                                <span class="text-muted small" v-if="articulo.DetallesTecnicos">
                                                    <i class="fa-solid fa-circle-info me-1"></i>{{ articulo.DetallesTecnicos }}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex gap-1 align-items-center">
                                                <span v-if="articulo.Talla" class="badge bg-light text-dark border">
                                                    {{ articulo.Talla }}
                                                </span>
                                                <span v-if="articulo.Color" class="badge border d-flex align-items-center" 
                                                      :style="getBadgeStyle(articulo.Color)">
                                                    <span class="me-1 d-inline-block rounded-circle" 
                                                          style="width: 8px; height: 8px; background-color: rgba(255,255,255,0.5);"></span>
                                                    {{ articulo.Color }}
                                                </span>
                                                <span v-if="!articulo.Talla && !articulo.Color" class="text-muted small">-</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge" :class="getCategoriaClass(articulo.Categoria)">
                                                {{ articulo.Categoria || 'General' }}
                                            </span>
                                        </td>
                                        <td class="fw-bold text-success">
                                            ${{ Number(articulo.PrecioVenta).toFixed(2) }}
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <span class="fw-bold fs-6">{{ articulo.StockActual }}</span>
                                                <i v-if="articulo.StockActual <= articulo.CantidadMinima" 
                                                   class="fa-solid fa-circle-exclamation text-danger ms-2" 
                                                   title="Stock Bajo"></i>
                                            </div>
                                            <div class="progress" style="height: 4px; width: 60px;">
                                                <div class="progress-bar" :class="getStockColor(articulo)" 
                                                     role="progressbar" 
                                                     :style="{ width: Math.min((articulo.StockActual / (articulo.CantidadMaxima || 100)) * 100, 100) + '%' }">
                                                </div>
                                            </div>
                                        </td>
                                        <td class="text-end pe-4">
                                            <router-link :to="{ name: 'ArticuloEditar', params: { id: articulo.IdArticulo } }" 
                                                class="btn btn-outline-primary btn-sm me-1 border-0 bg-light">
                                                <i class="fa-solid fa-pen"></i>
                                            </router-link>
                                            <button @click="confirmDelete(articulo)" 
                                                class="btn btn-outline-danger btn-sm border-0 bg-light">
                                                <i class="fa-regular fa-trash-can"></i>
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
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import articuloService from '@/services/articuloService';

const articulos = ref([]);
const loading = ref(false);
const error = ref(null);
const authStore = useAuthStore();
const router = useRouter();

const totalStock = computed(() => {
    return articulos.value.reduce((sum, item) => sum + Number(item.StockActual), 0);
});

const loadArticulos = async () => {
    loading.value = true;
    error.value = null;
    try {
        articulos.value = await articuloService.getArticulos();
    } catch (err) {
        if (err.response?.status === 401) {
             error.value = "Sesión expirada. Por favor, inicie sesión de nuevo.";
             authStore.logout();
        } else {
            error.value = "Hubo un error al recuperar los datos del catálogo.";
        }
        console.error(err);
    } finally {
        loading.value = false;
    }
};

onMounted(loadArticulos);

const confirmDelete = async (articulo) => {
    if (confirm(`¿Eliminar "${articulo.NomArticulo}"?`)) {
        try {
            await articuloService.deleteArticulo(articulo.IdArticulo);
            loadArticulos(); 
        } catch (error) {
            alert("Error al eliminar: " + (error.response?.data?.msg || "Desconocido"));
        }
    }
};
// 1. Clase de categoría
const getCategoriaClass = (cat) => {
    if (!cat) return 'bg-secondary';
    const c = cat.toUpperCase();
    if (c === 'TEXTIL') return 'bg-info text-dark';
    if (c === 'INSUMOS') return 'bg-warning text-dark';
    if (c === 'TAZAS') return 'bg-success';
    return 'bg-secondary';
};
// 2. Barra de progreso de stock
const getStockColor = (art) => {
    if (art.StockActual <= art.CantidadMinima) return 'bg-danger';
    if (art.StockActual >= art.CantidadMaxima) return 'bg-success';
    return 'bg-primary';
};
// 3. Pintar el badge del color real
const getBadgeStyle = (nombreColor) => {
    const colores = {
        'negro': '#212529', 'black': '#212529',
        'blanco': '#f8f9fa', 'white': '#f8f9fa',
        'rojo': '#dc3545', 'red': '#dc3545',
        'azul': '#0d6efd', 'blue': '#0d6efd', 'marino': '#002f6c',
        'verde': '#198754', 'green': '#198754',
        'amarillo': '#ffc107', 'yellow': '#ffc107',
        'rosa': '#d63384', 'pink': '#d63384', 'fucsia': '#d63384',
        'gris': '#6c757d', 'gray': '#6c757d',
        'naranja': '#fd7e14', 'orange': '#fd7e14',
        'morado': '#6f42c1', 'purple': '#6f42c1'
    };
    
    const bg = colores[nombreColor?.toLowerCase()] || '#e9ecef';
    
    const isDark = ['negro', 'black', 'azul', 'marino', 'rojo', 'verde', 'morado', 'gris'].includes(nombreColor?.toLowerCase());
    
    return {
        backgroundColor: bg,
        color: isDark ? 'white' : '#212529',
        borderColor: isDark ? 'transparent' : '#dee2e6'
    };
};
</script>

<style scoped>
.minimal-bg { background-color: #f8f9fa; min-height: 100vh; }
.minimal-card { border-radius: 12px; overflow: hidden; }
.minimal-table th { font-weight: 600; text-transform: uppercase; font-size: 0.75rem; color: #6c757d; letter-spacing: 0.5px; }
.minimal-btn { border-radius: 8px; padding: 8px 16px; font-weight: 500; transition: all 0.2s; }
.minimal-btn:hover { transform: translateY(-1px); }
</style>