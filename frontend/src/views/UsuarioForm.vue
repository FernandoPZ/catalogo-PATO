<template>
    <div class="container py-4 minimal-bg">
        <div class="row">
            <div class="col-12 col-md-8 col-lg-6 mx-auto">
                <div class="card border-0 shadow-sm minimal-card">
                    <div class="card-body p-4">
                        <h4 class="card-title mb-4 fw-bold">
                            {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
                        </h4>
                        <form @submit.prevent="guardarUsuario">
                            <div class="mb-3">
                                <label class="form-label text-muted small fw-bold">Nombre Completo</label>
                                <input 
                                    v-model="usuario.nombre" 
                                    type="text" 
                                    class="form-control minimal-input" 
                                    required
                                    placeholder="Ej. Juan Pérez"
                                >
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small fw-bold">Correo Electrónico</label>
                                <input 
                                    v-model="usuario.email" 
                                    type="email" 
                                    class="form-control minimal-input" 
                                    required
                                    placeholder="nombre@correo.com"
                                >
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small fw-bold">
                                    Contraseña
                                    <span v-if="isEditing" class="fw-normal text-muted fst-italic ms-1">(Dejar en blanco para mantener la actual)</span>
                                </label>
                                <input 
                                    v-model="usuario.password" 
                                    type="password" 
                                    class="form-control minimal-input" 
                                    :required="!isEditing"
                                    placeholder="••••••••"
                                >
                            </div>
                            <div class="mb-4">
                                <label class="form-label text-muted small fw-bold">Rol de Usuario</label>
                                <select v-model="usuario.rol" class="form-select minimal-input" required>
                                    <option value="" disabled>Selecciona un rol</option>
                                    <option value="ADMIN">Administrador (Acceso Total)</option>
                                    <option value="VENDEDOR">Vendedor (Solo Ventas)</option>
                                    <option value="ALMACEN">Almacén (Inventario)</option>
                                </select>
                            </div>
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-light minimal-btn" @click="$router.push('/usuarios')">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn btn-primary minimal-btn px-4" :disabled="loading">
                                    {{ loading ? 'Guardando...' : 'Guardar Usuario' }}
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import usuarioService from '@/services/usuarioService';

const route = useRoute();
const router = useRouter();
const isEditing = computed(() => !!route.params.id);
const loading = ref(false);
const usuario = ref({
    nombre: '',
    email: '',
    password: '',
    rol: ''
});

onMounted(async () => {
    if (isEditing.value) {
        loading.value = true;
        try {
            const data = await usuarioService.getUsuarioById(route.params.id);
            
            usuario.value = {
                nombre: data.Nombre,
                email: data.Email,
                rol: data.Rol,
                password: ''
            };
        } catch (error) {
            console.error(error);
            alert("Error al cargar los datos del usuario");
            router.push('/usuarios');
        } finally {
            loading.value = false;
        }
    }
});

const guardarUsuario = async () => {
    loading.value = true;
    try {
        if (isEditing.value) {
            await usuarioService.updateUsuario(route.params.id, usuario.value);
            alert('Usuario actualizado correctamente');
        } else {
            await usuarioService.createUsuario(usuario.value);
            alert('Usuario creado correctamente');
        }
        router.push('/usuarios');
    } catch (error) {
        console.error(error);
        alert('Error al guardar el usuario');
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.minimal-bg { background-color: #f8f9fa; min-height: 90vh; }
.minimal-card { border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); }
.minimal-input { border-radius: 8px; border: 1px solid #e2e8f0; padding: 0.6rem 1rem; }
.minimal-input:focus { border-color: #646cff; box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1); }
.minimal-btn { border-radius: 8px; font-weight: 500; transition: all 0.2s; }
</style>