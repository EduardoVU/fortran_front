import { defineStore } from 'pinia'
import api from '@/api/api'

export const inputStore = defineStore('inputStore', () => {

  const addItem = async (item: any) => {
    const headers = { 'Content-Type': 'application/json' }
    try {
      const response = await api.addItem(item, headers);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error al agregar el ítem',
        status: error.status || 500,
      };
    }
  }
  return { addItem }
})
