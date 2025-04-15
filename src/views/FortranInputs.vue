<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { inputStore } from '@/stores/FortranInputs'

interface Formulario {
    carpeta: string
    archivos: string[]
}

const store = inputStore();
const { addItem } = store;

const formulario = reactive<Formulario>({
    carpeta: '',
    archivos: ['']
})

const studiosNumbers = ref<number>(1)

watch(studiosNumbers, (newVal) => {
    const cantidad = newVal < 1 ? 1 : parseInt(String(newVal))
    formulario.archivos = Array.from({ length: cantidad }, (_, i) => formulario.archivos[i] || '')
    studiosNumbers.value = cantidad
})

const submitForm = async () => {
  const result = await addItem({ option: 'fortran', item: formulario });

  if (!result.success) {
    console.log("result");
    console.log(result);
    return;
  }

  console.log("Guardado exitoso:", result);
}
</script>

<template>
    <h1>Fortran Inputs</h1>
    <p>This is the Fortran Inputs page.</p>

    <form @submit.prevent="submitForm">
        <fieldset>
            <label for="numero">Número de pruebas</label>
            <input id="numero" type="number" v-model.number="studiosNumbers" placeholder="Número de pruebas" />
        </fieldset>

        <fieldset>
            <label for="carpeta">Título de la carpeta</label>
            <input id="carpeta" type="text" v-model="formulario.carpeta" placeholder="Título de carpeta" />
        </fieldset>

        <fieldset v-for="(archivo, index) in formulario.archivos" :key="index">
            <label :for="'archivo-' + index">Título del txt con número de prueba {{ index + 1 }} antes del "_"</label>
            <input :id="'archivo-' + index" type="text" v-model="formulario.archivos[index]"
                placeholder="Título de archivo principal" />
        </fieldset>

        <button type="submit">Generar</button>
    </form>
</template>

<style scoped>
fieldset {
    display: grid;
    gap: 5px;
    border: 0;
}

form {
    display: grid;
    gap: 5px;
}
</style>
