const PI = 3.1416;
let edad = 20;
edad = 21;
const persona = { nombre: "Juan" };
persona.nombre = "Juanjo";

if (true) {
  let enBloque = "solo vive aquí";
  var seEscapa = "var ignora el bloque";
}
console.log(seEscapa);

const numero = 42;
const texto = `Edad: ${edad}`;
const booleano = true;
const indefinido = undefined;
const nulo = null;
const grande = 9007199254740993n;
const simbolo = Symbol("id");

const arreglo = [1, 2, 3];
const objeto = { carrera: "Sistemas", semestre: 5 };
const flecha = (n) => n * 2;

console.log(typeof null);
console.log(typeof NaN);
console.log(Array.isArray(arreglo));
console.log(0.1 + 0.2 === 0.3);

console.log("5" + 3);
console.log("5" - 3);
console.log(5 == "5");
console.log(5 === "5");

let x = 10;
let y = x;
y = 20;
console.log(x, y);

const a1 = [1, 2];
const a2 = a1;
a2.push(3);
console.log(a1);

const copia = [...a1];
copia.push(4);
console.log(a1, copia);

//DIFFERENCE ABOUT VAR AND LET//

console.log(mensaje); // undefined, NO error (var se iza pero sin valor)
var mensaje = "hola";

console.log(nombre2); // ❌ ReferenceError (TDZ: existe pero está "bloqueada")
let nombre2 = "Juan";

let nivel = "afuera";
{
  let nivel = "adentro";
  console.log(nivel); // "adentro"
}
console.log(nivel);

console.log([] == false);      // true  (raro)
console.log([] == ![]);        // true  (¡todavía más raro!)
console.log(null == undefined); // true
console.log(null === undefined); // false
console.log(NaN === NaN);       // false → NaN nunca es igual a sí mismo
console.log(Object.is(NaN, NaN)); // true → Object.is corrige ese caso especial

// Valores "falsy": todo lo que se comporta como false en un if
console.log(Boolean(0), Boolean(""), Boolean(null), Boolean(undefined), Boolean(NaN));

const original = { datos: { edad: 20 } };
const copiaSuperficial = { ...original };
copiaSuperficial.datos.edad = 99;
console.log(original.datos.edad); // 99 → ¡el spread NO copia lo que está anidado!

const copiaProfunda = structuredClone(original);
copiaProfunda.datos.edad = 1;
console.log(original.datos.edad); // sigue en 99 → esta sí es independiente de verdad
