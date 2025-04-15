import { defineStore } from 'pinia'
import api from '@/api/api'

export const inputStore = defineStore('inputStore', () => {

    const addItem = async (item: any) => {
        const headers = { 'Content-Type': 'application/json' }
        console.log("Entramos al store")
        try {
            const response = await api.addItem(item, headers);
            return response.data;
          } catch (error: any) {
            console.log("error")
            console.log(error)
            return {
              success: false,
              message: error.response?.data?.message || 'Error al agregar el ítem',
              status: error.response?.status || 500,
              error: error
            };
          }
    }
    return { addItem }
})
