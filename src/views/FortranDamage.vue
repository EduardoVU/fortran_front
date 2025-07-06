<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { inputStore } from "@/stores/FortranInputs";
import navitagor from "@/components/navitagor.vue";


const store = inputStore();
const desplazamiento = ref<number>(3);
const data = reactive<{ masa: string; desplazamiento: string; height: string }[]>(
    Array.from({ length: 3 }, () => ({ masa: '', desplazamiento: '', height: '' }))
);
const name = ref<string>("");

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
    const hasEmptyField = data.some(item =>
        !item.masa.trim() || !item.desplazamiento.trim() || !item.height.trim()
    );

    if (hasEmptyField) {
        alert("Todos los campos deben estar completos.");
        return;
    }

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
                    <label :for="`mass__${index}`">Peso en kg</label>
                    <input type="text" v-model="data[index].masa" :id="`mass__${index}`" />
                </div>
                <div>
                    <label :for="`desplazamiento__${index}`">Desplazamiento</label>
                    <input type="text" v-model="data[index].desplazamiento" :id="`desplazamiento__${index}`" />
                </div>
                <div>
                    <label :for="`height__${index}`">Altura en cm</label>
                    <input type="text" v-model="data[index].height" :id="`height__${index}`" />
                </div>
            </fieldset>

            <button type="button" @click="desplazamiento++">Agregar desplazamiento</button>
            <button type="button" @click="desplazamiento = Math.max(1, desplazamiento - 1)"
                class="delete-section">Eliminar
                desplazamiento</button>
            <button type="submit">Crear gráfica</button>
        </form>
    </main>

</template>

<style scoped>
main {
    display: grid;
    background-color: #F0F2F5;
    flex-grow: 1;
    padding: 40px 20px;
}

h1 {
    font-family: "Fira Sans", sans-serif;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    color: #1E2A38;
    margin-bottom: 30px;
}

form.container {
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    width: min(100%, 600px);
    padding: 32px;
    background-color: #fff;
    border-radius: 16px;
    border: 1px solid #DEE2E6;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    font-family: "Inter", sans-serif;
}

form>div {
    grid-column: span 2;
}

form>div,
fieldset>div {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label {
    font-size: 1rem;
    font-weight: 600;
    color: #1E2A38;
}

input[type="text"] {
    font-family: "Inter", sans-serif;
    font-size: 1rem;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1.5px solid #ccc;
    transition: border-color 0.2s ease-in-out;
}

input[type="text"]:focus {
    border-color: #004080;
    outline: none;
}

fieldset {
    display: grid;
    grid-column: span 2;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    padding: 16px;
    border: 1px solid #B0B9C4;
    border-radius: 12px;
    background-color: #F9FAFB;
}

button {
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 32px;
    border: 1px solid #004080;
    background-color: #fff;
    color: #004080;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    width: fit-content;
    justify-self: start;
}

button:hover {
    background-color: #004080;
    color: #fff;
}

button[type="submit"] {
    width: 100%;
    grid-column: span 2;
}

.delete-section {
    justify-self: end;
}

@media (max-width: 480px) {
    form.container {
        width: 100%;
        padding: 24px 16px;
        grid-template-columns: 1fr;
    }

    .delete-section {
        justify-self: unset;
    }

    fieldset {
        grid-template-columns: 1fr;
        grid-column: span 1;
    }

    button {
        width: 100%;
    }

    button[type="submit"] {
        grid-column: span 1;
    }

    form>div {
        grid-column: span 1;
    }

}
</style>
