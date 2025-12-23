<template>
    <div class="container-fluid py-4 minimal-bg">
        <div class="row g-4">
            <div class="col-12 col-md-7 col-lg-8">
                <div class="card border-0 shadow-sm h-100 minimal-card">
                    <div class="card-header bg-white border-0 pt-3 pb-0">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-bold mb-0">Catálogo</h5>
                            <input 
                                v-model="busqueda" 
                                type="text" 
                                class="form-control minimal-input w-50" 
                                placeholder="Buscar..."
                            >
                        </div>
                        <ul class="nav nav-tabs card-header-tabs">
                            <li class="nav-item">
                                <a 
                                    class="nav-link fw-bold" 
                                    :class="{ active: tabActiva === 'ARTICULOS' }"
                                    href="#" 
                                    @click.prevent="tabActiva = 'ARTICULOS'"
                                >
                                    Articulos
                                </a>
                            </li>
                            <li class="nav-item">
                                <a 
                                    class="nav-link fw-bold" 
                                    :class="{ active: tabActiva === 'COMBOS' }"
                                    href="#" 
                                    @click.prevent="tabActiva = 'COMBOS'"
                                >
                                    Kits
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body overflow-auto" style="max-height: 75vh;">
                        <div v-if="tabActiva === 'ARTICULOS'" class="row g-3">
                            <div v-for="articulo in articulosFiltrados" :key="articulo.IdArticulo" class="col-6 col-md-4 col-xl-3">
                                <div class="card h-100 border-0 shadow-sm product-card" :class="{'opacity-50': articulo.StockActual === 0}">
                                    <div class="card-body p-3 text-center d-flex flex-column justify-content-between">
                                        <div>
                                            <h6 class="fw-bold text-truncate" :title="articulo.NomArticulo">{{ articulo.NomArticulo }}</h6>
                                            <p class="text-primary fw-bold mb-1">${{ Number(articulo.PrecioVenta).toFixed(2) }}</p> <small class="text-muted d-block mb-2">Stock: {{ articulo.StockActual }}</small>
                                        </div>
                                        <button 
                                            class="btn btn-sm btn-outline-primary w-100 rounded-pill"
                                            @click="agregarAlCarrito(articulo, 'ARTICULO')"
                                            :disabled="articulo.StockActual === 0"
                                        >
                                            {{ articulo.StockActual === 0 ? 'Agotado' : 'Agregar' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="row g-3">
                            <div v-if="combos.length === 0" class="col-12 text-center text-muted mt-5">
                                No hay combos activos configurados.
                            </div>
                            <div v-for="combo in combosFiltrados" :key="combo.IdCombo" class="col-6 col-md-4 col-xl-3">
                                <div class="card h-100 border-0 shadow-sm product-card bg-warning bg-opacity-10">
                                    <div class="card-body p-3 text-center d-flex flex-column justify-content-between">
                                        <div>
                                            <span class="badge bg-warning text-dark mb-2">OFERTA</span>
                                            <h6 class="fw-bold text-truncate" :title="combo.Nombre">{{ combo.Nombre }}</h6>
                                            <p class="text-success fw-bold fs-5 mb-1">${{ Number(combo.Precio).toFixed(2) }}</p>
                                        </div>
                                        <button 
                                            class="btn btn-sm btn-success w-100 rounded-pill text-white fw-bold"
                                            @click="agregarAlCarrito(combo, 'COMBO')"
                                        >
                                            Agregar Combo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-12 col-md-5 col-lg-4">
                <div class="card border-0 shadow-sm h-100 minimal-card">
                    <div class="card-header bg-white border-0 py-3">
                        <h5 class="fw-bold mb-0">Ticket de Venta</h5>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="flex-grow-1 overflow-auto mb-3" style="max-height: 50vh;">
                            <div v-if="carrito.length === 0" class="text-center text-muted py-5">
                                <p>El carrito está vacío</p>
                                <small>Selecciona productos o combos</small>
                            </div>
                            <ul v-else class="list-group list-group-flush">
                                <li v-for="(item, index) in carrito" :key="index" class="list-group-item px-0 py-3">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <div>
                                            <span v-if="item.tipo === 'COMBO'" class="badge bg-warning text-dark me-1" style="font-size: 0.7em;">K</span>
                                            <span class="fw-bold">{{ item.nombre }}</span>
                                        </div>
                                        <span class="fw-bold">${{ (item.precio * item.cantidad).toFixed(2) }}</span>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="input-group input-group-sm" style="width: 100px;">
                                            <button class="btn btn-outline-secondary" @click="decrementar(index)">-</button>
                                            <input type="text" class="form-control text-center bg-white" :value="item.cantidad" readonly>
                                            <button class="btn btn-outline-secondary" @click="incrementar(index, item)">+</button>
                                        </div>
                                        <button class="btn btn-sm text-danger" @click="eliminarDelCarrito(index)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Cliente (Opcional)</label>
                            <div class="input-group">
                                <span class="input-group-text bg-white"><i class="fa-solid fa-user"></i></span>
                                <input 
                                    v-model="clienteNombre"
                                    type="text"
                                    class="form-control minimal-input border-start-0"
                                    placeholder="Público General"
                                >
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Punto de Entrega (QR)</label>
                            <select v-model="puntoSeleccionado" class="form-select minimal-input">
                                <option :value="null">-- Sin Punto de Entrega --</option>
                                <option v-for="p in puntosEntrega" :key="p.IdPunto" :value="p">
                                    {{ p.NombrePunto }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Fecha de Entrega</label>
                            <div class="input-group">
                                <span class="input-group-text bg-white"><i class="fa-regular fa-calendar"></i></span>
                                <input 
                                    v-model="fechaEntrega" 
                                    type="date" 
                                    class="form-control minimal-input border-start-0"
                                >
                            </div>
                        </div>
                        <div class="mt-auto border-top pt-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Subtotal:</span>
                                <span>${{ totalVenta.toFixed(2) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                                <span class="fw-bold fs-4">Total:</span>
                                <span class="fw-bold fs-4 text-primary">${{ totalVenta.toFixed(2) }}</span>
                            </div>
                            <button 
                                class="btn btn-success w-100 py-3 fw-bold rounded-3 shadow-sm"
                                :disabled="carrito.length === 0 || loadingVenta"
                                @click="procesarVenta"
                            >
                                {{ loadingVenta ? 'Procesando...' : 'COBRAR TICKET' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import articuloService from '@/services/articuloService';
import comboService from '@/services/comboService';
import ventaService from '@/services/ventaService';
import { generarTicketPDF } from '@/utils/ticketGenerator';
import logoImg from '@/assets/Logo01.png';
import marcImg from '@/assets/Logo02.png';
import instaImg from '@/assets/Instagram.png';
import configService from '@/services/configService';
import puntosService from '@/services/puntosEntregaService';

const authStore = useAuthStore();
const articulos = ref([]);
const combos = ref([]);
const carrito = ref([]);
const busqueda = ref("");
const loadingVenta = ref(false);
const tabActiva = ref('ARTICULOS');
const configTienda = ref({});
const clienteNombre = ref("");
const puntosEntrega = ref([]);
const puntoSeleccionado = ref(null);
const fechaEntrega = ref(new Date().toISOString().substr(0, 10));

onMounted(async () => {
    cargarDatos();
});

const cargarDatos = async () => {
    try {
        const [resArticulos, resCombos] = await Promise.all([
            articuloService.getArticulos(),
            comboService.getCombos()
        ]);
        articulos.value = resArticulos;
        combos.value = resCombos;
        configTienda.value = await configService.getConfig();
        puntosEntrega.value = await puntosService.getPuntos();
    } catch (error) {
        console.error("Error cargando datos", error);
    }
};

const articulosFiltrados = computed(() => {
    return articulos.value.filter(a => a.NomArticulo.toLowerCase().includes(busqueda.value.toLowerCase()));
});
const combosFiltrados = computed(() => {
    return combos.value.filter(c => c.Nombre.toLowerCase().includes(busqueda.value.toLowerCase()));
});
const totalVenta = computed(() => {
    return carrito.value.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
});

const agregarAlCarrito = (item, tipo) => {
    const id = tipo === 'ARTICULO' ? item.IdArticulo : item.IdCombo;
    const nombre = tipo === 'ARTICULO' ? item.NomArticulo : item.Nombre;
    const precio = tipo === 'ARTICULO' ? Number(item.PrecioVenta) : Number(item.Precio);
    const maxStock = tipo === 'ARTICULO' ? item.StockActual : 9999;
    const existe = carrito.value.find(i => i.id === id && i.tipo === tipo);

    if (existe) {
        if (existe.cantidad < maxStock) {
            existe.cantidad++;
        } else {
            alert("No hay suficiente stock.");
        }
    } else {
        carrito.value.push({
            id,
            tipo,
            nombre,
            precio,
            cantidad: 1,
            maxStock,
            NomArticulo: nombre
        });
    }
};

const incrementar = (index, item) => {
    if (item.cantidad < item.maxStock) {
        carrito.value[index].cantidad++;
    }
};

const decrementar = (index) => {
    if (carrito.value[index].cantidad > 1) {
        carrito.value[index].cantidad--;
    } else {
        eliminarDelCarrito(index);
    }
};

const eliminarDelCarrito = (index) => {
    carrito.value.splice(index, 1);
};

const procesarVenta = async () => {
    if (!confirm(`¿Confirmar venta por $${totalVenta.value.toFixed(2)}?`)) return;
    if (!puntoSeleccionado.value) {
        if(!confirm("¿Deseas continuar sin punto de entrega? (No saldrá QR)")) return;
    }

    loadingVenta.value = true;
    try {
        const payload = {
            idUsuario: authStore.user.IdUsuario,
            total: totalVenta.value,
            clienteNombre: clienteNombre.value,
            productos: carrito.value.map(item => ({
                id: item.id,
                tipo: item.tipo,
                cantidad: item.cantidad,
                precio: item.precio
            }))
        };

        const respuesta = await ventaService.crearVenta(payload);

        generarTicketPDF(
            respuesta.idVenta, 
            authStore.user.Nombre || 'Cajero', 
            carrito.value, 
            totalVenta.value,
            logoImg,
            marcImg,
            instaImg,
            configTienda.value,
            clienteNombre.value,
            puntoSeleccionado.value ? puntoSeleccionado.value.LinkGoogleMaps : null,
            fechaEntrega.value
        );
        
        alert("¡Venta exitosa!");
        carrito.value = []; 
        cargarDatos();

    } catch (error) {
        console.error(error);
        alert("Error al procesar la venta.");
    } finally {
        loadingVenta.value = false;
    }
};
</script>

<style scoped>
.product-card { transition: transform 0.2s; cursor: pointer; }
.product-card:hover { transform: translateY(-3px); }
.minimal-input { border-radius: 20px; border: 1px solid #e2e8f0; padding-left: 15px; }
.nav-tabs .nav-link { color: #6c757d; border: none; }
.nav-tabs .nav-link.active { color: #0d6efd; border-bottom: 3px solid #0d6efd; background: transparent; }
</style>