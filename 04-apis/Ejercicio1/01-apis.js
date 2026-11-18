const url = "https://pokeapi.co/api/v2/pokemon/kaleth";

async function main(){
    const respuesta = await fetch(url);
    console.log("Código de respuesta: ", respuesta.status);
    console.log("¿Ok?: ", respuesta.ok);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        console.log("KALETH NO EXISTE");
        return;
    }

    console.log("Datos de KALETH: ", datos);
}

main();