import { defineStore } from 'pinia'
import api from '@/api/api'

export const inputStore = defineStore('inputStore', () => {
  
  const addItem = async (item: any) => {
    const headers = item.item instanceof FormData ? {} : { 'Content-Type': 'application/json' };

    try {
      const response = await api.addItem(item, headers);
      return {
        success: response.data?.success ?? false,
        data: response.data?.file ?? null, // Aseguramos que data esté presente solo si success es true
        message: response.data?.message ?? 'Operación completada',
        status: response.status
      };
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
