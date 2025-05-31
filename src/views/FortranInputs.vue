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
        const response = await store.addItem({ option: "fortran", item: formData });
        console.log("response")
        console.log(response)

        if (response.success) {
            const base64Data = response.data;
            console.log("Base64 recibido (primeros 100 caracteres):", base64Data.substring(0, 100));
            downloadBase64File(base64Data, "main.f90");
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
</script>

<template>
    <navitagor />
    <main>
        <h1>Generar Archivo Main</h1>

        <form @submit.prevent="submitForm">
            <input type="file" ref="fileInput" accept=".txt" multiple @change="setValue" />
            <button type="submit">Generar</button>
        </form>
    </main>
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