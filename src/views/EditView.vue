<script setup>
import { useTodoStore } from '../stores/todos'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const todoStore = useTodoStore()
const todoID = ref(-1)
const showModal = ref(false)

const editTodo = async (selectedTodo) => {
  try {
    if (!selectedTodo.name || !selectedTodo.status) {
      router.push({ name: 'todo-list' })
      return
    }
    const bodyData = {
      name: selectedTodo.name,
      status: selectedTodo.status,
    }
    await todoStore.updateTodo(todoID.value, bodyData)
    showModal.value = true
  } catch (error) {
    console.log('update error : ', error)
    router.push({ name: 'todo-list' })
  }
}

const closeModal = () => {
  showModal.value = false
  router.push({ name: 'todo-list' })
}

onMounted(async () => {
  try {
    await todoStore.loadTodo(route.params.id)
    todoID.value = parseInt(route.params.id)
    if (!todoStore.selectedTodo.name || !todoStore.selectedTodo.status) {
      router.push({ name: 'todo-list' })
    }
  } catch (error) {
    console.log('Todo not found:', error)
    router.push({ name: 'todo-list' })
  }
})
</script>
<template>
  <div class="container mx-auto p-4">
    <div class="text-lg font-bold mb-4">Edit ID : {{ todoID }}</div>
    <RouterLink :to="{ name: 'todo-list' }" class="btn btn-secondary mb-4">
      Back
    </RouterLink>
    <div class="form-control w-full max-w-xs mb-4">
      <label for="name" class="label">
        <span class="label-text">Name:</span>
      </label>
      <input
        id="name"
        v-model="todoStore.selectedTodo.name"
        type="text"
        required
        class="input input-bordered w-full max-w-xs"
      />
    </div>
    <div class="form-control w-full max-w-xs mb-4">
      <label for="status" class="label">
        <span class="label-text">Status:</span>
      </label>
      <select
        v-model="todoStore.selectedTodo.status"
        class="select select-bordered w-full max-w-xs"
      >
        <option value="" disabled>select status</option>
        <option
          v-for="status in todoStore.statuses"
          :key="status"
          :value="status"
        >
          {{ status }}
        </option>
      </select>
    </div>
    <button @click="editTodo(todoStore.selectedTodo)" class="btn btn-primary">
      EDIT
    </button>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">Update Successful</h2>
        <p>Your todo has been updated successfully.</p>
        <button @click="closeModal" class="btn btn-primary mt-4">
          Return to Todo List
        </button>
      </div>
    </div>
  </div>
</template>
