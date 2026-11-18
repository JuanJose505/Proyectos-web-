// pokeapi.service.js
const BASE_URL = "https://pokeapi.co/api/v2/";

export async function pedir(ruta) {
    const respuesta = await fetch(BASE_URL + ruta);
    if (!respuesta.ok) {
        throw new Error("Error en la petición: " + respuesta.status);
    }
    return respuesta.json();
}

export async function obtenerPokemon(nombre) { 
    return pedir(`/pokemon/${nombre}`);
}

export async function listarPokemon(limite = 10) {
    return pedir(`/pokemon?limit=${limite}`);
}

export async function obtenerTipo(tipo) {
    return pedir(`/type/${tipo}`);
}