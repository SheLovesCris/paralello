/*
 * detalle.js
 * Lee el id de la URL (detalle.html?id=3) y rellena la ficha con los datos
 * del producto que hay en mockData.js.
 */

const params = new URLSearchParams(location.search);
const id = Number(params.get('id')) || 2; // si no viene id, enseño la lámpara como en el Hito 1
const producto = productos.find(p => p.id === id);

const nombresCat = { calzado: 'Calzado', audio: 'Audio', objetos: 'Objetos', wearables: 'Wearables' };

if (!producto) {
  // Id que no existe: aviso y vuelta al catálogo
  abrirModal({
    titulo: 'Objeto no encontrado',
    texto: 'Este objeto ya no está disponible o el enlace no es correcto.',
    textoAceptar: 'Volver al catálogo'
  }).then(() => { location.href = 'index.html'; });
} else {
  document.title = `PARA//LELO · ${producto.nombre}`;

  const img = document.getElementById('detalle-img');
  img.src = producto.imagenGrande || producto.imagen;
  img.alt = producto.alt;

  document.getElementById('detalle-num').textContent = `Nº ${String(producto.id).padStart(2, '0')}`;
  document.getElementById('detalle-cat').textContent = `${nombresCat[producto.categoria]} / Drop ${String(producto.drop).padStart(2, '0')}`;
  document.getElementById('detalle-nombre').textContent = producto.nombre;
  document.getElementById('detalle-precio').textContent = `€${producto.precio}`;
  document.getElementById('detalle-stock').textContent = `${producto.stock} unidades disponibles`;
  document.getElementById('detalle-desc').textContent = producto.descripcion;

  const btnComprar = document.getElementById('btn-comprar');
  btnComprar.querySelector('span').textContent = `Añadir al carrito · €${producto.precio}`;

  btnComprar.addEventListener('click', async () => {
    const ok = await abrirModal({
      titulo: '¿Añadir al carrito?',
      texto: `Vas a añadir ${producto.nombre} por €${producto.precio}.`,
      tipo: 'confirmar',
      textoAceptar: 'Sí, añadir'
    });
    if (!ok) return;
    actualizarCarrito(leerCarrito() + 1);
    abrirModal({
      titulo: 'Añadido',
      texto: `${producto.nombre} ya está en tu carrito.`,
      textoAceptar: 'Genial'
    });
  });

  // Botón de favoritos (en el Hito 1 estaba como onclick en el HTML)
  const fav = document.querySelector('.fav');
  fav.addEventListener('click', () => {
    const activo = fav.getAttribute('aria-pressed') === 'true';
    fav.setAttribute('aria-pressed', String(!activo));
  });
}
