<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { inputStore } from "@/stores/FortranInputs";
import navitagor from "@/components/navitagor.vue";


const store = inputStore();
const desplazamiento = ref<number>(1);
const data = reactive<{ masa: string; desplazamiento: string; height: string }[]>([]);
const name = ref<string>("");

// Inicializar el primer elemento para evitar error en v-model al principio
if (data.length === 0) {
    data.push({ masa: '', desplazamiento: '', height: '' });
}

// Watch para agregar o quitar elementos en data según desplazamiento.value
watch(desplazamiento, (newVal, oldVal) => {
    if (newVal > oldVal) {
        // Agregar elemento(s)
        for (let i = oldVal; i < newVal; i++) {
            data.push({ masa: '', desplazamiento: '', height: '' });
        }
    } else if (newVal < oldVal) {
        // Quitar elemento(s)
        data.splice(newVal, oldVal - newVal);
    }
});

const createPlot = async () => {
    const value = data.map(obj => ({
        masa: parseFloat(obj.masa),
        desplazamiento: parseFloat(obj.desplazamiento),
        height: parseFloat(obj.height) / 100
    }));

    const item = {
        name: name.value,
        value
    }

    try {
        const response = await store.addItem({ option: "plots-damage", item });

        if (!response.success) throw response;
        downloadBase64File(response.data, 'Índice de daño.pdf')
    } catch (error) {
        console.log("error")
        console.log(error)
    }
}

const downloadBase64File = (base64Data: string, filename: string) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "text/plain" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
</script>

<template>
    <navitagor />
    <main>
        <h1>Generar Índice de Daño</h1>
        <form class="container" @submit.prevent="createPlot">
            <div>
                <label for="">Nombre</label>
                <input type="text" v-model="name" />
            </div>
            <fieldset v-for="(_, index) in desplazamiento" :key="index">
                <div>
                    <label>Peso en kg</label>
                    <input type="text" v-model="data[index].masa" />
                </div>
                <div>
                    <label>Desplazamiento</label>
                    <input type="text" v-model="data[index].desplazamiento" />
                </div>
                <div>
                    <label>Altura en centímetros</label>
                    <input type="text" v-model="data[index].height" />
                </div>
            </fieldset>

            <button type="button" @click="desplazamiento++">Agregar desplazamiento</button>
            <button type="button" @click="desplazamiento = Math.max(1, desplazamiento - 1)">Eliminar
                desplazamiento</button>
            <button type="submit">Crear gráfica</button>
        </form>
    </main>

</template>

<style scoped lang="scss"></style>
