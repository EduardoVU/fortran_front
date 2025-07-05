<script setup lang="ts">
import { ref } from "vue";
import { inputStore } from "@/stores/FortranInputs";
import navitagor from "@/components/navitagor.vue";

const store = inputStore();
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);

// Manejar selección de archivos
const setValue = () => {
    const filesInput = fileInput.value?.files;
    if (filesInput) {
        files.value = Array.from(filesInput);
    }
};

// Enviar archivos y procesar respuesta
const submitForm = async () => {
    if (files.value.length === 0) {
        alert("Debes seleccionar al menos un archivo.");
        return;
    }

    const formData = new FormData();
    files.value.forEach(file => formData.append("files", file));

    try {
        const response = await store.addItem({ option: "plots", item: formData });
        if (response.success) {
            const base64Data = response.data;
            console.log("Base64 recibido (primeros 100 caracteres):", base64Data.substring(0, 100));
            downloadBase64File(base64Data, "Graficas.pdf");
        } else {
            console.error("Error en el backend:", response.message);
            alert("Error al generar el archivo. Intenta nuevamente.");
        }
    } catch (error) {
        console.error("Error al enviar archivos:", error);
        alert("Ocurrió un error al enviar los archivos.");
    }
};

// Descargar archivo generado en Base64 usando Blob para evitar corrupción
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

const openInput = () => fileInput.value?.click();

const clearData = () => {
    fileInput.value!.value = "";
    files.value = [];
}

</script>
<template>
    <navitagor />
    <main>
        <h1>Generar Graficos</h1>

        <form @submit.prevent="submitForm">
            <input type="file" ref="fileInput" accept=".txt" multiple @change="setValue" />
            <button type="button" @click="openInput()">Seleccionar Archivos</button>
            <div v-if="files.length > 0" class="info-data">
                <label for="cancel-button">
                    {{ files.length === 1 ? '1 archivo seleccionado' : `${files.length} archivos
                    seleccionados` }}
                </label>

                <button type="button" class="cancel-button" id="cancel-button" @click="clearData()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                        stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                    </svg>

                </button>
            </div>
            <button type="submit">Generar</button>
        </form>
    </main>
</template>
<style scoped>
main {
    display: flex;
    flex-direction: column;
    background-color: #F0F2F5;
    flex-grow: 1;

    padding: 40px 20px;
}

.container {
    margin: 0 auto;
    width: min(100%, 1440px);
}

h1 {
    font-family: "Fira Sans", sans-serif;
    font-weight: 700;
    text-align: center;
    color: #1E2A38;

    font-size: 2rem;
    margin-bottom: 25px;
}

form {
    margin: 0 auto;
    display: grid;
    background-color: #ffffff;

    gap: 16px;
    width: min(100%, 500px);
    padding: 32px;
    border-radius: 16px;
    border: 1px solid #DEE2E6;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}


form button {
    font-family: "Inter", sans-serif;
    font-weight: 600;
    background-color: #ffffff;
    color: #004080;
    width: 100%;
    transition: all 0.2s ease-in-out;

    border: 1px solid #004080;
    font-size: 1rem;
    border-radius: 32px;
    min-height: 44px;
}

form button:hover {
    background-color: #004080;
    color: #ffffff;
}

.info-data {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    width: fit-content;
    margin: 0 auto;

    gap: 12px;
}

.info-data .cancel-button {
    display: grid;
    place-items: center;

    min-height: unset;
    aspect-ratio: 1;
}

.info-data .cancel-button svg {
    transition: stroke 0.3s ease;

    width: 18px;
    height: 18px;
}

.info-data .cancel-button:hover {
    background-color: #004080;
}

.info-data .cancel-button:hover svg {
    stroke: #FFF;
}

label,
p {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    color: #333333;

    font-size: 1rem;
}
</style>