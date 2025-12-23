<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom mb-4 px-3 minimal-card">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand d-flex align-items-center py-0">
        <img :src="logoImg" alt="Logo" height="50" class="d-inline-block align-text-top">
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav" v-if="authStore.isAuthenticated">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle fw-bold" href="#" @click.prevent role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-store"></i> Operaciones
            </a>
            <ul class="dropdown-menu border-0 shadow-sm">
              <li><router-link to="/pos" class="dropdown-item"><i class="fa-solid fa-cash-register me-1"></i> Punto de Venta</router-link></li>
              <li><router-link to="/entradas/nueva" class="dropdown-item"><i class="fa-solid fa-box-open me-1"></i> Resurtir (Compras)</router-link></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle fw-bold" href="#" @click.prevent role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-book-open"></i> Catálogos
            </a>
            <ul class="dropdown-menu border-0 shadow-sm">
              <li><router-link to="/articulos" class="dropdown-item"><i class="fa-solid fa-boxes-stacked me-1"></i> Artículos</router-link></li>
              <li><router-link to="/proveedores" class="dropdown-item"><i class="fa-solid fa-truck me-1"></i> Proveedores</router-link></li>
              <li><router-link to="/kits" class="dropdown-item"><i class="fa-solid fa-boxes-packing me-1"></i> Kits</router-link></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle fw-bold" href="#" @click.prevent role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-clipboard-list"></i> Historiales
            </a>
            <ul class="dropdown-menu border-0 shadow-sm">
              <li><router-link to="/historial/ventas" class="dropdown-item text-success"><i class="fa-solid fa-shop me-1"></i><i class="fa-regular fa-circle-left me-1"></i> Ventas</router-link></li>
              <li><router-link to="/historial/compras" class="dropdown-item text-danger"><i class="fa-solid fa-shop me-1"></i><i class="fa-regular fa-circle-right me-1"></i> Compras</router-link></li>
            </ul>
          </li>
          <li class="nav-item dropdown" v-if="authStore.user?.Rol === 'ADMIN'">
            <a class="nav-link dropdown-toggle fw-bold text-primary" href="#" @click.prevent role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-gears"></i> Administración
            </a>
            <ul class="dropdown-menu border-0 shadow-sm">
              <li>
                <router-link to="/configuracion" class="dropdown-item">
                    <i class="fa-solid fa-store me-1"></i> Datos de la Tienda
                </router-link>
              </li>
              <li>
                <router-link to="/puntos-entrega" class="dropdown-item">
                    <i class="fa-solid fa-map-location-dot me-1"></i> Puntos de Entrega
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link to="/usuarios" class="dropdown-item">
                    <i class="fa-solid fa-users-gear me-1"></i> Gestión de Usuarios
                </router-link>
              </li>
              <li>
                  <router-link to="/bitacora" class="dropdown-item">
                      <i class="fa-solid fa-list-check me-1"></i> Bitácora
                  </router-link>
              </li>
            </ul>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <span class="text-muted me-3 d-none d-lg-block">
            Hola, <strong>{{ authStore.user?.Nombre || 'Usuario' }}</strong>
          </span>
          <button @click="themeStore.toggleTheme()" class="btn btn-link nav-link me-3 text-secondary">
              <i v-if="themeStore.theme === 'light'" class="fa-solid fa-moon fs-5"></i>
              <i v-else class="fa-solid fa-sun fs-5 text-warning"></i>
          </button>
          <button @click="handleLogout" class="btn btn-outline-danger btn-sm rounded-pill px-3">
            <i class="fa-solid fa-right-from-bracket me-1"></i> Salir
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { Dropdown } from 'bootstrap';
import logoImg from '@/assets/logo01.png';
import { useThemeStore } from '@/stores/theme';

const authStore = useAuthStore();
const router = useRouter();
const themeStore = useThemeStore();

onMounted(() => {
  const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
  [...dropdownElementList].map(dropdownToggleEl => new Dropdown(dropdownToggleEl));
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar { border-radius: 0 0 1rem 1rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
.nav-link { color: #64748b; padding: 0.5rem 1rem !important; transition: color 0.2s; }
.nav-link:hover, .nav-link.active { color: #0d6efd; }
.dropdown-menu { border-radius: 0.8rem; margin-top: 10px; }
.dropdown-item { padding: 0.5rem 1.2rem; border-radius: 0.4rem; margin: 0 0.2rem; width: auto; }
.dropdown-item:active { background-color: #0d6efd; }
</style>