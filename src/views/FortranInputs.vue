<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { inputStore } from '@/stores/FortranInputs'

const store = inputStore();
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);


const setValue = () => {
    const filesInput = fileInput.value?.files;
    if (filesInput) {
        files.value = Array.from(filesInput);
    }
}

const submitForm = async () => {
    console.log("submitForm");

    if (files.value.length === 0) {
        return;
    }

    const formData = new FormData();
    files.value.forEach(file => {
        formData.append("files", file);  // ✅ Aquí el nombre "files" debe coincidir con FastAPI
    });

    try {
        const response = await store.addItem({ option: 'fortran', item: formData });
        console.log("response", response);

        if (response.success) {
            const base64Data = response.file;
            // Convertir el base64 a un Blob
            const blob = base64ToBlob(base64Data, "text/plain");
            downloadBlob(blob, "main.f90"); // Puedes cambiar el nombre del archivo aquí
        }
    } catch (error) {
        console.error("Error al enviar archivos:", error);
    }
}

const base64ToBlob = (base64: any, mimeType: any) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

// Función para descargar el Blob
const downloadBlob = (blob: any, filename: any) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
</script>

<template>
    <h1>Fortran Inputs</h1>
    <p>This is the Fortran Inputs page.</p>

    <form @submit.prevent="submitForm">
        <input type="file" id="file-input" ref="fileInput" accept=".txt" multiple @change="setValue" />

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
