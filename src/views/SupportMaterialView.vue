<template>
  <div class="support-material-view">
    <h1>Gestión de Material de Soporte</h1>

    <!-- Crear -->
    <div class="create-section">
      <h2>Crear Material</h2>
      <input type="text" v-model="newMaterial.name" placeholder="Nombre del material" />
      <input type="text" v-model="newMaterial.description" placeholder="Descripción" />
      <button @click="createMaterial">Crear</button>
    </div>

    <!-- Actualizar -->
    <div class="update-section">
      <h2>Actualizar Material</h2>
      <input type="text" v-model="updateMaterial.id" placeholder="ID del material" />
      <input type="text" v-model="updateMaterial.name" placeholder="Nuevo nombre" />
      <input type="text" v-model="updateMaterial.description" placeholder="Nueva descripción" />
      <button @click="updateMaterialById">Actualizar</button>
    </div>

    <!-- Eliminar -->
    <div class="delete-section">
      <h2>Eliminar Material</h2>
      <input type="text" v-model="deleteMaterialId" placeholder="ID del material" />
      <button @click="deleteMaterial">Eliminar</button>
    </div>

    <!-- Obtener con filtro -->
    <div class="filter-section">
      <h2>Buscar Material</h2>
      <input type="text" v-model="searchQuery" placeholder="Buscar por nombre" />
      <button @click="fetchMaterials">Buscar</button>
    </div>

    <!-- Resultados -->
    <div class="results-section">
      <h2>Resultados</h2>
      <ul>
        <li v-for="material in filteredMaterials" :key="material.id">
          {{ material.name }} - {{ material.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      newMaterial: {
        name: '',
        description: ''
      },
      updateMaterial: {
        id: '',
        name: '',
        description: ''
      },
      deleteMaterialId: '',
      searchQuery: '',
      materials: []
    };
  },
  computed: {
    filteredMaterials() {
      return this.materials.filter(material =>
        material.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    createMaterial() {
      // Lógica para crear material
      console.log('Crear material:', this.newMaterial);
    },
    updateMaterialById() {
      // Lógica para actualizar material
      console.log('Actualizar material:', this.updateMaterial);
    },
    deleteMaterial() {
      // Lógica para eliminar material
      console.log('Eliminar material con ID:', this.deleteMaterialId);
    },
    fetchMaterials() {
      // Lógica para obtener materiales
      console.log('Buscar materiales con filtro:', this.searchQuery);
    }
  }
};
</script>

<style scoped>
.support-material-view {
  padding: 20px;
}
.create-section,
.update-section,
.delete-section,
.filter-section,
.results-section {
  margin-bottom: 20px;
}
</style>

