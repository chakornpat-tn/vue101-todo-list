<script setup>
import { useTodoStore } from '../stores/todos'
import { RouterLink } from 'vue-router'
import { onMounted, ref, computed } from 'vue'

const todosStore = useTodoStore()
const todo = ref('')
const selectedStatus = ref('pending')
const filterTodoList = computed(() => {
  return todosStore.list.filter((todo) => todo.status === selectedStatus.value)
})

const changeStatus = async (event, todoID) => {
  if (event.target.checked)
    await todosStore.updateTodo(todoID, { status: 'done' })
  else await todosStore.updateTodo(todoID, { status: 'doing' })

  await todosStore.loadTodos()
}

const changeSelectedStatus = async (status) => {
  selectedStatus.value = status
}

onMounted(async () => {
  await todosStore.loadTodos()
})
</script>
<template>
  <div>
    <div class="flex">
      <input
        class="input input-bordered w-full hover:[&>svg]:fill-white"
        v-model="todo"
        placeholder="Todo Name"
      />
      <button class="btn btn-primary ml-2" @click="todosStore.addTodo(todo)">
        ADD
      </button>
    </div>
    <div role="tablist" class="tabs tabs-boxed my-1">
      <a
        role="tab"
        v-for="(status, index) in todosStore.statuses"
        :class="selectedStatus === status ? 'tab tab-active' : 'tab'"
        @click="changeSelectedStatus(status)"
        :key="index"
        >{{ status }}</a
      >
    </div>
    <div
      v-for="todo in filterTodoList"
      :key="todo.id"
      class="flex items-center justify-between mt-2 hover:[&>svg]fill-white"
    >
      <div class="flex gap-1">
        <input
          type="checkbox"
          class="checkbox"
          :checked="todo.status === 'done'"
          @change="changeStatus($event, todo.id)"
        />
        <p :class="todo.status === 'done' ? 'line-through' : ''">
          {{ todo.name }}
        </p>
      </div>

      <div class="flex gap-1">
        <RouterLink :to="{ name: 'todo-edit', params: { id: todo.id } }">
          <button>
            <svg
              class="btn btn-square btn-outline btn-sm p-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path
                d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"
              />
            </svg>
          </button>
        </RouterLink>

        <button @click="todosStore.removeTodo(todo.id)">
          <svg
            class="btn btn-square btn-outline btn-sm p-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              d="M416 208H32c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h384c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
  fill: white;
}
</style>
