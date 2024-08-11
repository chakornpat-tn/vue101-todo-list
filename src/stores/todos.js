import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_TODO_API_URL

export const useTodoStore = defineStore('todo', {
  state: () => ({
    list: [],
    selectedTodo: {},
    statuses: ['pending', 'doing', 'done'],
  }),
  actions: {
    async loadTodos() {
      try {
        const Load_URL = API_URL
        const response = await axios.get(Load_URL)
        this.list = response.data
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    },
    async loadTodo(id) {
      try {
        const Load_URL = `${API_URL}/${id}`
        const response = await axios.get(Load_URL)
        this.selectedTodo = response.data
      } catch (error) {
        console.error(`Error fetching todo with id ${id}:`, error)
      }
    },
    async addTodo(todo) {
      try {
        const Add_URL = API_URL
        const response = await axios.post(Add_URL, {
          name: todo,
          status: 'pending',
        })
        this.list.push(response.data)
        console.log('add todo complete')
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    },

    async removeTodo(id) {
      try {
        const Remove_URL = `${API_URL}/${id}`
        await axios.delete(Remove_URL)
        this.list = this.list.filter((todo) => todo.id !== id)
        console.log('remove todo complete')
      } catch (error) {
        console.error('Error removing todo:', error)
      }
    },
    async updateTodo(id, data) {
      try {
        const Update_URL = `${API_URL}/${id}`
        const UpdateData = {
          name: data.name,
          status: data.status,
        }
        const response = await axios.put(Update_URL, UpdateData)
        const index = this.list.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.list[index] = response.data
        }
        console.log('update todo complete')
      } catch (error) {
        console.error('Error updating todo:', error)
      }
    },
  },
})
