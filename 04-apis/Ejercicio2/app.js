// app.js
import { pedir, obtenerPokemon, listarPokemon, obtenerTipo } from './pokeapi.service.js';
async function ejecutarApp() {
    try {
        console.log("\n<><><><> Obteniendo información de Pikachu <><><><>");
        const pikachu = await obtenerPokemon('pikachu');
        console.log("Nombre:", pikachu.name);
        console.log("Peso:", pikachu.weight);

        console.log("\n<><><><> Listando los primeros 10 Pokémon <><><><>");
        const lista = await listarPokemon(10);
        console.log(lista.results);

        console.log("\n<><><><> Obteniendo información del tipo 'fire' <><><><>");
        const tipoLand = await obtenerTipo('fire');
        console.log(`Pokémon de tipo fuego encontrados: ${tipoLand.pokemon.length}`);

    } catch (error) {
        console.error("Hubo un error en la ejecución:", error.message);
    }
}
ejecutarApp();