<template>
  <div class="materials-container">
    <div class="toolbar">
      <button @click="showForm = !showForm" class="btn-create">Crear</button>
      <div class="search-box">
        <input v-model="search" placeholder="Search" class="input-search"/>
        <span class="icon-search">🔍</span>
      </div>
    </div>

    <transition name="fade">
      <form v-if="showForm" @submit.prevent="createMaterial" class="material-form">
        <input v-model="form.name" placeholder="Nombre" class="form-input" />
        <input v-model.number="form.levelId" type="number" placeholder="Nivel" class="form-input" />
        <input v-model="form.link" placeholder="Link" class="form-input" />
        <textarea v-model="form.description" placeholder="Descripción" class="form-textarea"></textarea>
        <button type="submit" class="form-button">Guardar</button>
      </form>
    </transition>

    <table class="materials-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Nivel</th>
          <th>Descripción</th>
          <th>Link</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredMaterials" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.levelId }}</td>
          <td>{{ item.description }}</td>
          <td><a :href="item.link" target="_blank">{{ item.link }}</a></td>
          <td class="options">
            <span @click="editMaterial(item)" class="icon">⚙️</span>
            <span @click="deleteMaterial(item.id)" class="icon">❌</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SupportMaterialService from '@/services/SupportMaterialService'

interface Material {
  id: number
  name: string
  levelId: number
  description: string
  link: string
}

const materials = ref<Material[]>([])
const form = ref({ name: '', levelId: 1, description: '', link: '' })
const showForm = ref(false)
const search = ref('')

const loadMaterials = async () => {
  try {
    materials.value = await SupportMaterialService.getAll()
  } catch (error) {
    console.error('Error al cargar materiales:', error)
  }
}

const filteredMaterials = computed(() => {
  if (!search.value) return materials.value
  return materials.value.filter(item =>
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const createMaterial = async () => {
  try {
    await SupportMaterialService.create({
      name: form.value.name,
      level_id: form.value.levelId,
      description: form.value.description,
      link: form.value.link,
    })
    form.value = { name: '', levelId: 1, description: '', link: '' }
    showForm.value = false
    await loadMaterials()
  } catch (error) {
    console.error('Error al crear:', error)
  }
}

const editMaterial = (item: Material) => {
  form.value = { ...item }
  form.value = { name: item.name, levelId: item.levelId, description: item.description, link: item.link }
  showForm.value = true
}

const deleteMaterial = async (id: number) => {
  try {
    await SupportMaterialService.delete(id)
    await loadMaterials()
  } catch (error) {
    console.error('Error al eliminar:', error)
  }
}

onMounted(loadMaterials)
</script>

<style scoped>
.materials-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  background: #f9f0ff;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.btn-create {
  background: #d8b4fe;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.search-box {
  position: relative;
}

.input-search {
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 20px;
}

.icon-search {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.material-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-input,
.form-textarea {
  flex: 1 1 45%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-textarea {
  flex: 1 1 100%;
  min-height: 60px;
}

.form-button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #d8b4fe;
  color: #000;
  border-radius: 4px;
  cursor: pointer;
}

.materials-table {
  width: 100%;
  border-collapse: collapse;
}

.materials-table th,
.materials-table td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.materials-table th {
  background: #c4b5fd;
  color: #fff;
  text-transform: uppercase;
}

.options .icon {
  margin-right: 0.5rem;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
