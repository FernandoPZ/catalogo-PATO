<template>
    <div class="container-fluid py-3 minimal-bg">
        <div class="card border-0 shadow-sm mb-3 minimal-card">
            <div class="card-body p-2"> <div class="row g-2 align-items-center">
                    <div class="col-md-3 d-flex align-items-center ps-3">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
                            <i class="fa-solid fa-truck-ramp-box small"></i>
                        </div>
                        <h6 class="mb-0 fw-bold text-dark">Nueva Entrada</h6>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-light border-end-0 text-muted">
                                <i class="fa-solid fa-user-tie"></i>
                            </span>
                            <select v-model="idProveedor" class="form-select border-start-0 minimal-input shadow-none" style="background-color: #f8f9fa;">
                                <option value="" disabled selected>Seleccionar Proveedor...</option>
                                <option v-for="prov in proveedores" :key="prov.IdProveedor" :value="prov.IdProveedor">
                                    {{ prov.NomProveedor }} ({{ prov.RFC || 'Sin RFC' }})
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-light border-end-0 text-muted">
                                <i class="fa-solid fa-hashtag"></i>
                            </span>
                            <input v-model="comentarios" type="text" class="form-control border-start-0 minimal-input shadow-none" placeholder="Referencia / Factura / Notas..." style="background-color: #f8f9fa;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row g-3 h-100">
            <div class="col-md-5 d-flex flex-column">
                <div class="card border-0 shadow-sm flex-grow-1 minimal-card" style="min-height: 500px;">
                    <div class="card-header bg-white border-0 pt-3 pb-2">
                        <div class="input-group">
                            <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-search text-muted"></i></span>
                            <input v-model="busqueda" type="text" class="form-control minimal-input border-start-0" placeholder="Buscar producto (Nombre o Código)...">
                        </div>
                    </div>
                    <div class="card-body overflow-auto p-0">
                        <div class="list-group list-group-flush">
                            <button 
                                v-for="art in articulosFiltrados" 
                                :key="art.IdArticulo"
                                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-3 border-bottom-0"
                                @click="agregarALista(art)"
                            >
                                <div class="w-100">
                                    <div class="d-flex justify-content-between">
                                        <h6 class="mb-0 fw-bold text-dark small">{{ art.NomArticulo }}</h6>
                                        <small class="text-muted" style="font-size: 0.7rem;">Stock: {{ art.StockActual }}</small>
                                    </div>
                                    <div class="d-flex gap-1 mt-1">
                                        <span v-if="art.Talla" class="badge bg-light text-dark border py-0 px-1" style="font-size: 0.65rem;">{{ art.Talla }}</span>
                                        <span v-if="art.Color" class="badge border py-0 px-1" :style="[getBadgeStyle(art.Color), {fontSize: '0.65rem'}]">{{ art.Color }}</span>
                                        <span v-if="!art.Talla && !art.Color" class="badge bg-secondary py-0 px-1" style="font-size: 0.65rem;">Gral</span>
                                    </div>
                                </div>
                                <span class="ms-2 text-primary"><i class="fa-solid fa-circle-plus"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-7 d-flex flex-column">
                <div class="card border-0 shadow-sm flex-grow-1 minimal-card" style="min-height: 500px;">
                    <div class="card-header bg-white border-0 pt-3 pb-2 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0 text-secondary text-uppercase small ls-1">Detalle de Recepción</h6>
                        <span class="badge bg-light text-dark border">{{ listaEntrada.length }} items</span>
                    </div>
                    <div class="card-body p-0 overflow-auto position-relative">
                        <table class="table align-middle mb-0 table-hover table-sm">
                            <thead class="bg-light sticky-top" style="z-index: 5;">
                                <tr>
                                    <th class="ps-3 small text-muted">DESCRIPCIÓN</th>
                                    <th style="width: 80px;" class="small text-muted text-center">CANT.</th>
                                    <th style="width: 100px;" class="small text-muted text-center">COSTO</th>
                                    <th class="text-end pe-3 small text-muted">SUBTOTAL</th>
                                    <th style="width: 40px;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="listaEntrada.length === 0">
                                    <td colspan="5" class="text-center py-5 text-muted align-middle" style="height: 200px;">
                                        <i class="fa-solid fa-arrow-left me-2"></i>Agrega productos
                                    </td>
                                </tr>
                                <tr v-for="(item, index) in listaEntrada" :key="index">
                                    <td class="ps-3">
                                        <div class="fw-bold text-dark small">{{ item.NomArticulo }}</div>
                                        <div class="d-flex gap-1">
                                            <small v-if="item.Talla" class="text-muted" style="font-size: 0.7rem;">{{ item.Talla }}</small>
                                            <small v-if="item.Color" class="text-muted" style="font-size: 0.7rem;">/ {{ item.Color }}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <input type="number" min="1" class="form-control form-control-sm text-center fw-bold p-0" v-model.number="item.Cantidad">
                                    </td>
                                    <td>
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text bg-white border-0 px-1 text-muted">$</span>
                                            <input type="number" min="0" step="0.50" class="form-control border-0 p-0" v-model.number="item.Costo">
                                        </div>
                                    </td>
                                    <td class="text-end pe-3 fw-bold text-dark small">
                                        ${{ (item.Cantidad * item.Costo).toFixed(2) }}
                                    </td>
                                    <td class="text-center">
                                        <button class="btn btn-sm btn-link text-danger p-0 text-decoration-none" @click="quitarDeLista(index)">
                                            <i class="fa-solid fa-times"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer bg-white border-top p-2">
                        <div class="row align-items-center g-2">
                            <div class="col-6">
                                <div class="text-end pe-2">
                                    <small class="text-muted d-block" style="line-height: 1;">TOTAL A PAGAR</small>
                                    <span class="fs-5 fw-bold text-success">${{ totalEntrada.toFixed(2) }}</span>
                                </div>
                            </div>
                            <div class="col-6">
                                <button 
                                    class="btn btn-dark w-100 btn-sm py-2 fw-bold shadow-sm"
                                    :disabled="listaEntrada.length === 0 || !idProveedor || loading"
                                    @click="guardarEntrada"
                                >
                                    <i v-if="loading" class="fa-solid fa-spinner fa-spin me-2"></i>
                                    {{ loading ? 'Procesando...' : 'FINALIZAR ENTRADA' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import proveedorService from '@/services/proveedorService';
import articuloService from '@/services/articuloService';
import entradaService from '@/services/entradaService';

const router = useRouter();
const proveedores = ref([]);
const articulos = ref([]);
const idProveedor = ref("");
const comentarios = ref("");
const listaEntrada = ref([]);
const busqueda = ref("");
const loading = ref(false);

onMounted(async () => {
    try {
        const [resProv, resArt] = await Promise.all([
            proveedorService.getProveedores(),
            articuloService.getArticulos()
        ]);
        proveedores.value = resProv;
        articulos.value = resArt;
    } catch (error) {
        console.error("Error cargando datos", error);
    }
});

const articulosFiltrados = computed(() => {
    if (!busqueda.value) return articulos.value;
    const s = busqueda.value.toLowerCase();
    return articulos.value.filter(a => 
        a.NomArticulo.toLowerCase().includes(s) || 
        (a.CodArticulo && a.CodArticulo.toLowerCase().includes(s))
    );
});

const totalEntrada = computed(() => {
    return listaEntrada.value.reduce((acc, item) => acc + (item.Cantidad * item.Costo), 0);
});

const agregarALista = (articulo) => {
    const existe = listaEntrada.value.find(i => i.IdArticulo === articulo.IdArticulo);
    if (existe) {
        existe.Cantidad++;
    } else {
        listaEntrada.value.push({
            IdArticulo: articulo.IdArticulo,
            NomArticulo: articulo.NomArticulo,
            Talla: articulo.Talla,
            Color: articulo.Color,
            Cantidad: 1,
            Costo: 0 
        });
    }
};

const quitarDeLista = (index) => {
    listaEntrada.value.splice(index, 1);
};

const guardarEntrada = async () => {
    if (!idProveedor.value) return alert("Selecciona un proveedor");
    if (listaEntrada.value.length === 0) return alert("Agrega productos");
    
    const costosCero = listaEntrada.value.some(i => i.Costo <= 0);
    if (costosCero && !confirm("⚠️ Algunos productos tienen Costo $0.00. ¿Es correcto?")) return;

    if (!confirm("¿Confirmar entrada? Se aumentará el stock.")) return;

    loading.value = true;
    try {
        const payload = {
            IdProveedor: idProveedor.value,
            Total: totalEntrada.value,
            Comentarios: comentarios.value,
            Productos: listaEntrada.value
        };

        await entradaService.createEntrada(payload);
        alert("¡Entrada registrada exitosamente!");
        router.push('/articulos'); 
    } catch (error) {
        console.error(error);
        alert("Error al registrar: " + (error.response?.data?.msg || "Error desconocido"));
    } finally {
        loading.value = false;
    }
};

const getBadgeStyle = (nombreColor) => {
    const colores = {
        'negro': '#212529', 'blanco': '#f8f9fa', 'rojo': '#dc3545', 
        'azul': '#0d6efd', 'verde': '#198754', 'amarillo': '#ffc107',
        'rosa': '#d63384', 'gris': '#6c757d', 'naranja': '#fd7e14', 'morado': '#6f42c1'
    };
    const bg = colores[nombreColor?.toLowerCase()] || '#e9ecef';
    const isDark = ['negro', 'azul', 'rojo', 'verde', 'morado', 'gris'].includes(nombreColor?.toLowerCase());
    return {
        backgroundColor: bg,
        color: isDark ? 'white' : '#212529',
        borderColor: isDark ? 'transparent' : '#dee2e6'
    };
};
</script>

<style scoped>
.minimal-bg { background-color: #f8f9fa; min-height: 100vh; }
.minimal-card { border-radius: 8px; overflow: hidden; }
.minimal-input { border: 1px solid #dee2e6; }
.minimal-input:focus { border-color: #adb5bd; }
.ls-1 { letter-spacing: 0.5px; }
.overflow-auto::-webkit-scrollbar { width: 6px; }
.overflow-auto::-webkit-scrollbar-track { background: #f1f1f1; }
.overflow-auto::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
.overflow-auto::-webkit-scrollbar-thumb:hover { background: #999; }
</style>