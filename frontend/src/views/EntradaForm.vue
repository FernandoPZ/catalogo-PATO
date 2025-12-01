<template>
    <div class="container-fluid py-4 minimal-bg">
        <div class="card border-0 shadow-sm mb-4 minimal-card">
            <div class="card-body p-4">
                <div class="row align-items-end">
                    <div class="col-md-6">
                        <h4 class="fw-bold mb-3">Registrar Entrada de Mercancía</h4>
                        <label class="form-label fw-bold small text-muted">Seleccionar Proveedor</label>
                        <select v-model="idProveedor" class="form-select minimal-input">
                            <option value="" disabled selected>-- Elige un proveedor --</option>
                            <option v-for="prov in proveedores" :key="prov.IdProveedor" :value="prov.IdProveedor">
                                {{ prov.NomProveedor }} (RFC: {{ prov.RFC }})
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label fw-bold small text-muted">Comentarios / Referencia Factura</label>
                        <input v-model="comentarios" type="text" class="form-control minimal-input" placeholder="Ej. Factura F-9923, Llegó incompleto...">
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-md-5">
                <div class="card border-0 shadow-sm h-100 minimal-card">
                    <div class="card-header bg-white border-0 pt-3">
                        <input v-model="busqueda" type="text" class="form-control minimal-input" placeholder="Buscar producto para agregar...">
                    </div>
                    <div class="card-body overflow-auto" style="max-height: 500px;">
                        <div class="list-group list-group-flush">
                            <button 
                                v-for="art in articulosFiltrados" 
                                :key="art.IdArticulo"
                                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                                @click="agregarALista(art)"
                            >
                                <div>
                                    <h6 class="mb-0 fw-bold">{{ art.NomArticulo }}</h6>
                                    <small class="text-muted">Stock actual: {{ art.StockActual }}</small>
                                </div>
                                <span class="badge bg-primary rounded-pill">+</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-7">
                <div class="card border-0 shadow-sm h-100 minimal-card">
                    <div class="card-header bg-white border-0 pt-3">
                        <h5 class="fw-bold">Productos Recibidos</h5>
                    </div>
                    <div class="card-body p-0 overflow-auto" style="max-height: 400px;">
                        <table class="table align-middle mb-0">
                            <thead class="bg-light sticky-top">
                                <tr>
                                    <th class="ps-3">Producto</th>
                                    <th style="width: 100px;">Cant.</th>
                                    <th style="width: 120px;">Costo U.</th>
                                    <th class="text-end pe-3">Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="listaEntrada.length === 0">
                                    <td colspan="5" class="text-center py-5 text-muted">Selecciona productos de la izquierda</td>
                                </tr>
                                <tr v-for="(item, index) in listaEntrada" :key="index">
                                    <td class="ps-3 fw-bold">{{ item.NomArticulo }}</td>
                                    <td>
                                        <input type="number" min="1" class="form-control form-control-sm text-center" v-model.number="item.Cantidad">
                                    </td>
                                    <td>
                                        <div class="input-group input-group-sm">
                                            <span class="input-group-text">$</span>
                                            <input type="number" min="0" step="0.01" class="form-control" v-model.number="item.Costo">
                                        </div>
                                    </td>
                                    <td class="text-end pe-3 fw-bold">${{ (item.Cantidad * item.Costo).toFixed(2) }}</td>
                                    <td>
                                        <button class="btn btn-sm text-danger" @click="quitarDeLista(index)">×</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer bg-white border-top p-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="fs-5 text-muted">Total Compra:</span>
                            <span class="fs-3 fw-bold text-success">${{ totalEntrada.toFixed(2) }}</span>
                        </div>
                        <button 
                            class="btn btn-success w-100 py-2 fw-bold minimal-btn"
                            :disabled="listaEntrada.length === 0 || !idProveedor || loading"
                            @click="guardarEntrada"
                        >
                            {{ loading ? 'Guardando...' : 'CONFIRMAR ENTRADA Y AUMENTAR STOCK' }}
                        </button>
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
    return articulos.value.filter(a => a.NomArticulo.toLowerCase().includes(busqueda.value.toLowerCase()));
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
    
    const costosInvalidos = listaEntrada.value.some(i => i.Costo <= 0);
    if (costosInvalidos && !confirm("Algunos productos tienen Costo $0. ¿Continuar así?")) return;

    if (!confirm("¿Confirmar entrada? Esto aumentará el stock de los productos seleccionados.")) return;

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
        alert("Error al registrar entrada");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.minimal-input { border-radius: 8px; border: 1px solid #dee2e6; }
.minimal-btn { border-radius: 8px; }
</style>