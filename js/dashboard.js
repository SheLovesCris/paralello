/*
 * dashboard.js
 * Pinta las tarjetas del catálogo a partir del array "productos" (mockData.js)
 * y gestiona el buscador en tiempo real junto con los filtros por categoría.
 */

const grid = document.getElementById('grid');
const plantilla = document.getElementById('tpl-tarjeta');
const buscador = document.getElementById('buscador');
const panelBusqueda = document.getElementById('panel-busqueda');
const btnBuscar = document.querySelector('.search-btn');
const btnLimpiar = document.getElementById('limpiar-busqueda');
const chips = document.querySelectorAll('.chip');
const contador = document.getElementById('contador-resultados');
const sinResultados = document.getElementById('sin-resultados');

// Estado de los filtros
let categoriaActiva = 'todo';
let textoBusqueda = '';

const nombresCategoria = {
  calzado: 'Calzado',
  audio: 'Audio',
  objetos: 'Objetos',
  wearables: 'Wearables'
};

/* Quita tildes y pasa a minúsculas para que "lampara" encuentre "LÁMPARA" */
function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/* Crea una tarjeta clonando el <template> y rellenando sus datos */
function crearTarjeta(producto, posicion) {
  const tarjeta = plantilla.content.cloneNode(true);

  tarjeta.querySelector('a').href = `detalle.html?id=${producto.id}`;

  const img = tarjeta.querySelector('img');
  img.src = producto.imagen;
  img.alt = producto.alt;

  tarjeta.querySelector('.num').textContent = String(posicion).padStart(2, '0');

  const stock = tarjeta.querySelector('.stock');
  if (producto.stock <= 4) {
    stock.textContent = `Solo ${producto.stock}`;
    stock.classList.add('low');
  } else {
    stock.textContent = `${producto.stock} disp.`;
  }

  tarjeta.querySelector('small').textContent = nombresCategoria[producto.categoria];
  tarjeta.querySelector('h3').textContent = producto.nombre;
  tarjeta.querySelector('.price').textContent = `€${producto.precio}`;

  return tarjeta;
}

/* Filtra el array y vuelve a pintar el grid */
function pintarCatalogo() {
  const busqueda = normalizar(textoBusqueda.trim());

  const filtrados = productos.filter(p => {
    const coincideCategoria = categoriaActiva === 'todo' || p.categoria === categoriaActiva;
    const coincideTexto =
      busqueda === '' ||
      normalizar(p.nombre).includes(busqueda) ||
      normalizar(p.descripcion).includes(busqueda) ||
      normalizar(nombresCategoria[p.categoria]).includes(busqueda);
    return coincideCategoria && coincideTexto;
  });

  // Uso un fragment para no tocar el DOM una vez por cada tarjeta
  const fragmento = document.createDocumentFragment();
  filtrados.forEach((p, i) => fragmento.appendChild(crearTarjeta(p, i + 1)));
  grid.replaceChildren(fragmento);

  // Mensaje cuando no hay nada
  sinResultados.hidden = filtrados.length > 0;
  if (filtrados.length === 0) {
    sinResultados.querySelector('strong').textContent = textoBusqueda.trim() || nombresCategoria[categoriaActiva];
  }

  contador.textContent = filtrados.length === 1
    ? '1 objeto'
    : `${filtrados.length} objetos`;
}

/* ---------- Eventos ---------- */

// Mostrar / ocultar la barra de búsqueda con la lupa
btnBuscar.addEventListener('click', () => {
  const abierto = btnBuscar.getAttribute('aria-expanded') === 'true';
  btnBuscar.setAttribute('aria-expanded', String(!abierto));
  panelBusqueda.hidden = abierto;
  if (!abierto) buscador.focus();
});

// Búsqueda en tiempo real: se filtra con cada tecla
buscador.addEventListener('input', () => {
  textoBusqueda = buscador.value;
  btnLimpiar.hidden = buscador.value === '';
  pintarCatalogo();
});

btnLimpiar.addEventListener('click', () => {
  buscador.value = '';
  textoBusqueda = '';
  btnLimpiar.hidden = true;
  buscador.focus();
  pintarCatalogo();
});

// Filtros por categoría (los chips del Hito 1, ahora combinados con el buscador)
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.setAttribute('aria-pressed', c === chip));
    categoriaActiva = chip.dataset.filter;
    pintarCatalogo();
  });
});

// Texto del hero con el número real de productos
document.getElementById('total-novedades').textContent = productos.length;

pintarCatalogo();
