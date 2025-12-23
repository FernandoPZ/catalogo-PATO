<template>
    <div class="container py-4 minimal-bg">
        <div class="row g-4">
            <div class="col-12 mx-auto">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="fw-semibold">Gestión de Usuarios <span class="text-muted">({{ totalUsuarios }})</span></h3>
                    <router-link :to="{ name: 'UsuarioNuevo' }" class="btn btn-success minimal-btn">
                        + Nuevo Usuario
                    </router-link>
                </div>
                <div v-if="loading" class="alert alert-info">Cargando usuarios...</div>
                <div v-if="error" class="alert alert-danger">Error: {{ error }}</div>
                <div class="table-responsive minimal-table-wrapper">
                    <table class="table table-borderless align-middle minimal-table">
                        <thead>
                            <tr class="bg-light">
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in usuarios" :key="user.IdUsuario">
                                <td class="text-muted">{{ user.IdUsuario }}</td>
                                <td class="fw-semibold">{{ user.Nombre }}</td>
                                <td>{{ user.Email }}</td>
                                <td>
                                    <span :class="user.Rol === 'ADMIN' ? 'badge bg-primary' : 'badge bg-secondary'">
                                        {{ user.Rol }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge bg-success" v-if="!user.BajaLogica">Activo</span>
                                    <span class="badge bg-danger" v-else>Inactivo</span>
                                </td>
                                <td>
                                    <router-link
                                        :to="{ name: 'UsuarioEditar', params: { id: user.IdUsuario } }"
                                        class="btn btn-sm btn-info me-2 minimal-btn"
                                    >
                                        Editar
                                    </router-link>
                                    <button @click="confirmDelete(user)" class="btn btn-sm btn-danger minimal-btn">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" class="text-end">Total de Usuarios:</td>
                                <td colspan="4"><strong>{{ totalUsuarios }}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import usuarioService from '@/services/usuarioService';

const usuarios = ref([]);
const loading = ref(false);
const error = ref(null);
const totalUsuarios = computed(() => usuarios.value.length);
const loadUsuarios = async () => {
    loading.value = true;
    error.value = null;
    try {
        usuarios.value = await usuarioService.getUsuarios();
    } catch (err) {
        console.error(err);
        error.value = "Error al conectar con el servidor.";
    } finally {
        loading.value = false;
    }
};

onMounted(loadUsuarios);

const confirmDelete = async (user) => {
    if (confirm(`¿Está seguro de desactivar al usuario: ${user.Nombre}?`)) {
        try {
            await usuarioService.deleteUsuario(user.IdUsuario);
            alert(`Usuario "${user.Nombre}" desactivado exitosamente.`);
            loadUsuarios();
        } catch (err) {
            alert("Error al eliminar usuario.");
            console.error(err);
        }
    }
};
</script>