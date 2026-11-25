/*
 * mockData.js
 * Simula la tabla "productos" de la base de datos del Proyecto 1.
 * Cada objeto tiene los mismos campos que tendría una fila de la BD.
 * Más adelante esto se sustituirá por un fetch() a la API.
 */
const productos = [
  {
    id: 1,
    nombre: "AIR//FORM 01",
    categoria: "calzado",
    precio: 189,
    stock: 8,
    imagen: "img/airform01.jpg",
    alt: "Zapatilla AIR//FORM 01 bajo una lámpara",
    descripcion: "Zapatilla de suela esculpida con espuma reciclada. Edición numerada.",
    drop: 6,
    fechaAlta: "2025-10-02"
  },
  {
    id: 2,
    nombre: "MONO LAMP 04",
    categoria: "objetos",
    precio: 124,
    stock: 12,
    imagen: "img/monolamp04_card.jpg",
    imagenGrande: "img/monolamp04.jpg",
    alt: "Lámpara amarilla MONO LAMP 04",
    descripcion: "Luz de escritorio ajustable en aluminio reciclado. Iluminación cálida con presencia radical.",
    drop: 6,
    fechaAlta: "2025-10-05"
  },
  {
    id: 3,
    nombre: "ICE//SOUND",
    categoria: "audio",
    precio: 249,
    stock: 4,
    imagen: "img/icesound.jpg",
    alt: "Auriculares ICE//SOUND sobre hielo",
    descripcion: "Auriculares inalámbricos con carcasa translúcida y cancelación de ruido.",
    drop: 6,
    fechaAlta: "2025-10-08"
  },
  {
    id: 4,
    nombre: "ARC VESSEL",
    categoria: "wearables",
    precio: 96,
    stock: 2,
    imagen: "img/arcvessel.jpg",
    alt: "Wearable ARC VESSEL sobre un pedestal",
    descripcion: "Pieza para llevar al cuello, a medio camino entre joya y escultura.",
    drop: 6,
    fechaAlta: "2025-10-11"
  },
  {
    id: 5,
    nombre: "ORBIT CHAIR 01",
    categoria: "objetos",
    precio: 340,
    stock: 3,
    imagen: "img/orbitchair.jpg",
    alt: "Silla ORBIT CHAIR 01 con asiento esférico naranja",
    descripcion: "Asiento esférico sobre trípode de acero. Ocupa poco y se nota mucho.",
    drop: 7,
    fechaAlta: "2025-10-20"
  },
  {
    id: 6,
    nombre: "GRID//RUNNER",
    categoria: "calzado",
    precio: 159,
    stock: 15,
    imagen: "img/gridrunner.jpg",
    alt: "Zapatilla GRID//RUNNER en color lima",
    descripcion: "Runner ligera con malla técnica y suela de doble densidad.",
    drop: 7,
    fechaAlta: "2025-10-22"
  },
  {
    id: 7,
    nombre: "PULSE BAND",
    categoria: "wearables",
    precio: 79,
    stock: 20,
    imagen: "img/pulseband.jpg",
    alt: "Pulsera PULSE BAND con degradado violeta",
    descripcion: "Pulsera con luz que cambia de color según tu ritmo cardiaco.",
    drop: 7,
    fechaAlta: "2025-10-25"
  },
  {
    id: 8,
    nombre: "VOID SPEAKER",
    categoria: "audio",
    precio: 210,
    stock: 6,
    imagen: "img/voidspeaker.jpg",
    alt: "Altavoz cilíndrico VOID SPEAKER negro",
    descripcion: "Altavoz de 360º con cuerpo de cerámica negra mate.",
    drop: 7,
    fechaAlta: "2025-10-28"
  }
];

/*
 * Simula la tabla "usuarios". Solo se usa para comprobar el login.
 * (En un proyecto real la contraseña nunca estaría en el cliente,
 * esto es únicamente para poder probar el formulario.)
 */
const usuarios = [
  { id: 1, nombre: "Alex Romero", email: "alex@parallelo.com", password: "Parallelo2025" }
];
