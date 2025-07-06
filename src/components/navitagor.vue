<script setup lang="ts"></script>
<template>
    <header>
        <nav>
            <ul>
                <li><router-link to="/">Generar main</router-link></li>
                <li><router-link to="/plots">Graficas</router-link></li>
                <li><router-link to="/damage-plots">Indice de daño</router-link></li>
            </ul>
        </nav>
    </header>
</template>
<style scoped>
nav {
    font-family: "Inter", sans-serif;
    background-color: #D3D3D3;

    padding: 16px 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

ul {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0 auto;
    padding: 0;

    gap: 24px;
    max-width: 1440px;
}

a {
    font-weight: 500;
    text-decoration: none;
    color: #004080;
    transition: background-color 0.2s ease, color 0.2s ease;
    width: 100%;
    display: block;
    text-align: center;

    font-size: 16px;
    padding: 6px 10px;
    border-radius: 6px;
}

a:hover {
    background-color: rgba(0, 64, 128, 0.1);
}

a.router-link-exact-active {
    font-weight: 600;
    color: #002F5F;

    border-bottom: 2px solid #004080;
}
</style>