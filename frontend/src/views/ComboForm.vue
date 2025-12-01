<template>
    <div class="container py-4 minimal-bg">
        <h4 class="fw-bold mb-4">{{ id ? 'Editar Kit' : 'Nuevo Kit de Productos' }}</h4>

        <div class="row g-4">
            <div class="col-md-5">
                <div class="card border-0 shadow-sm minimal-card p-3">
                    <h5 class="fw-bold mb-3">1. Datos Generales</h5>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Nombre del Kit</label>
                        <input v-model="form.Nombre" type="text" class="form-control minimal-input" placeholder="Ej. Paquete Escolar">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Código (Opcional)</label>
                        <input v-model="form.Codigo" type="text" class="form-control minimal-input" placeholder="KIT-001">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-bold text-success">Precio de Oferta ($)</label>
                        <input v-model.number="form.Precio" type="number" class="form-control minimal-input border-success" placeholder="0.00">
                        <small class="text-muted">Este es el precio final que pagará el cliente.</small>
                    </div>
                    <button @click="guardar" class="btn btn-success w-100 mt-3 fw-bold" :disabled="loading">
                        {{ loading ? 'Guardando...' : 'GUARDAR KIT' }}
                    </button>
                    <router-link to="/kits" class="btn btn-light w-100 mt-2">Cancelar</router-link>
                </div>
            </div>

            <div class="col-md-7">
                <div class="card border-0 shadow-sm minimal-card h-100">
                    <div class="card-header bg-white border-0 pt-3">
                        <h5 class="fw-bold mb-2">2. Contenido del Kit</h5>
                        <div class="input-group mb-2">
                            <span class="input-group-text bg-white border-end-0"><i class="fas fa-search"></i></span>
                            <input v-model="busqueda" type="text" class="form-control minimal-input border-start-0" placeholder="Buscar producto para agregar...">
                        </div>
                        <div v-if="busqueda && articulosFiltrados.length > 0" class="list-group position-absolute shadow w-75" style="z-index: 1000;">
                            <button 
                                v-for="art in articulosFiltrados.slice(0,5)" 
                                :key="art.IdArticulo"
                                class="list-group-item list-group-item-action d-flex justify-content-between"
                                @click="agregarIngrediente(art)"
                            >
                                <span>{{ art.NomArticulo }}</span>
                                <small class="text-muted">Stock: {{ art.StockActual }}</small>
                            </button>
                        </div>
                    </div>

                    <div class="card-body overflow-auto" style="max-height: 400px;">
                        <table class="table align-middle">
                            <thead class="bg-light">
                                <tr>
                                    <th>Producto</th>
                                    <th style="width: 100px;">Cantidad</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in form.Ingredientes" :key="index">
                                    <td>{{ item.NomArticulo }}</td>
                                    <td>
                                        <input type="number" min="1" class="form-control form-control-sm text-center" v-model.number="item.Cantidad">
                                    </td>
                                    <td class="text-end">
                                        <button @click="quitarIngrediente(index)" class="btn btn-sm text-danger"><i class="fas fa-times"></i></button>
                                    </td>
                                </tr>
                                <tr v-if="form.Ingredientes.length === 0">
                                    <td colspan="3" class="text-center text-muted py-4">Agrega productos usando el buscador ↑</td>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import articuloService from '@/services/articuloService';
import comboService from '@/services/comboService';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const form = ref({ Nombre: '', Codigo: '', Precio: 0, Ingredientes: [] });
const articulos = ref([]);
const busqueda = ref("");
const loading = ref(false);

onMounted(async () => {
    // 1. Cargar catálogo de productos para el buscador
    articulos.value = await articuloService.getArticulos();

    // 2. Si es edición, cargar datos del kit
    if (id) {
        const data = await comboService.getComboById(id);
        form.value = {
            Nombre: data.Nombre,
            Codigo: data.Codigo,
            Precio: Number(data.Precio),
            Ingredientes: data.ingredientes // El backend nos manda esto
        };
    }
});

// Filtro del buscador
const articulosFiltrados = computed(() => {
    if (!busqueda.value) return [];
    return articulos.value.filter(a => a.NomArticulo.toLowerCase().includes(busqueda.value.toLowerCase()));
});

// Acciones
const agregarIngrediente = (art) => {
    // Verificar si ya está
    const existe = form.value.Ingredientes.find(i => i.IdArticulo === art.IdArticulo);
    if (existe) {
        existe.Cantidad++;
    } else {
        form.value.Ingredientes.push({
            IdArticulo: art.IdArticulo,
            NomArticulo: art.NomArticulo,
            Cantidad: 1
        });
    }
    busqueda.value = ""; // Limpiar buscador
};

const quitarIngrediente = (index) => {
    form.value.Ingredientes.splice(index, 1);
};

const guardar = async () => {
    if (!form.value.Nombre || form.value.Precio <= 0) return alert("Nombre y Precio son obligatorios");
    if (form.value.Ingredientes.length === 0) return alert("El kit debe tener al menos un producto");

    loading.value = true;
    try {
        if (id) {
            await comboService.updateCombo(id, form.value);
        } else {
            await comboService.createCombo(form.value);
        }
        router.push('/kits');
    } catch (error) {
        console.error(error);
        alert("Error al guardar kit");
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.minimal-input { border-radius: 8px; border: 1px solid #dee2e6; padding: 10px; }
</style>