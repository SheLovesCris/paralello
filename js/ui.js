/*
 * ui.js
 * Componentes comunes a todas las páginas:
 *  - Menú hamburguesa para móvil
 *  - Modal reutilizable (avisos y confirmaciones)
 *  - Contador del carrito (se guarda en sessionStorage)
 */

/* ---------- MENÚ HAMBURGUESA ---------- */
function iniciarMenu() {
  const boton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('menu-principal');
  if (!boton || !nav) return;

  function cerrarMenu() {
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir menú');
    nav.classList.remove('abierto');
  }

  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    if (abierto) {
      cerrarMenu();
    } else {
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', 'Cerrar menú');
      nav.classList.add('abierto');
    }
  });

  // Si se pulsa Escape o se hace clic en un enlace, el menú se cierra
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarMenu();
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));

  // Si se agranda la ventana a escritorio, dejamos el menú en su estado normal
  window.matchMedia('(min-width: 48em)').addEventListener('change', cerrarMenu);
}

/* ---------- MODAL ---------- */
/*
 * abrirModal({ titulo, texto, tipo, textoAceptar, textoCancelar })
 * tipo: 'aviso' (un solo botón) o 'confirmar' (aceptar + cancelar)
 * Devuelve una promesa que se resuelve con true (aceptar) o false (cancelar).
 */
function abrirModal(opciones) {
  const {
    titulo = 'Aviso',
    texto = '',
    tipo = 'aviso',
    textoAceptar = 'Aceptar',
    textoCancelar = 'Cancelar'
  } = opciones;

  return new Promise(resolve => {
    const elementoAnterior = document.activeElement;

    const fondo = document.createElement('div');
    fondo.className = 'modal-fondo';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', tipo === 'confirmar' ? 'alertdialog' : 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-titulo');
    modal.setAttribute('aria-describedby', 'modal-texto');

    const h2 = document.createElement('h2');
    h2.id = 'modal-titulo';
    h2.textContent = titulo;

    const p = document.createElement('p');
    p.id = 'modal-texto';
    p.textContent = texto;

    const acciones = document.createElement('div');
    acciones.className = 'modal-acciones';

    const btnAceptar = document.createElement('button');
    btnAceptar.type = 'button';
    btnAceptar.className = 'btn-modal principal';
    btnAceptar.textContent = textoAceptar;

    if (tipo === 'confirmar') {
      const btnCancelar = document.createElement('button');
      btnCancelar.type = 'button';
      btnCancelar.className = 'btn-modal';
      btnCancelar.textContent = textoCancelar;
      btnCancelar.addEventListener('click', () => cerrar(false));
      acciones.appendChild(btnCancelar);
    }
    btnAceptar.addEventListener('click', () => cerrar(true));
    acciones.appendChild(btnAceptar);

    modal.append(h2, p, acciones);
    fondo.appendChild(modal);
    document.body.appendChild(fondo);
    document.body.classList.add('sin-scroll');

    // Pequeño retraso para que se vea la animación de entrada
    requestAnimationFrame(() => fondo.classList.add('visible'));
    btnAceptar.focus();

    function teclado(e) {
      if (e.key === 'Escape') cerrar(false);
      // Mantener el foco dentro del modal con Tab
      if (e.key === 'Tab') {
        const botones = modal.querySelectorAll('button');
        const primero = botones[0];
        const ultimo = botones[botones.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault(); ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault(); primero.focus();
        }
      }
    }
    document.addEventListener('keydown', teclado);

    // Clic fuera de la caja = cancelar
    fondo.addEventListener('click', e => {
      if (e.target === fondo) cerrar(false);
    });

    function cerrar(resultado) {
      document.removeEventListener('keydown', teclado);
      fondo.remove();
      document.body.classList.remove('sin-scroll');
      if (elementoAnterior) elementoAnterior.focus();
      resolve(resultado);
    }
  });
}

/* ---------- CARRITO ---------- */
function leerCarrito() {
  try {
    return Number(sessionStorage.getItem('carrito')) || 0;
  } catch (e) {
    return 0;
  }
}

function actualizarCarrito(cantidad) {
  try {
    sessionStorage.setItem('carrito', cantidad);
  } catch (e) { /* si el navegador no deja guardar, seguimos igual */ }
  const carrito = document.querySelector('.cart');
  if (carrito) {
    carrito.querySelector('span').textContent = cantidad;
    carrito.setAttribute('aria-label', `Carrito, ${cantidad} artículos`);
  }
}

function iniciarCarrito() {
  const carrito = document.querySelector('.cart');
  if (!carrito) return;
  actualizarCarrito(leerCarrito());

  carrito.addEventListener('click', async e => {
    e.preventDefault();
    const total = leerCarrito();
    if (total === 0) {
      abrirModal({ titulo: 'Carrito vacío', texto: 'Todavía no has añadido ningún objeto.' });
      return;
    }
    const vaciar = await abrirModal({
      titulo: 'Tu carrito',
      texto: `Tienes ${total} ${total === 1 ? 'objeto' : 'objetos'} en el carrito. ¿Quieres vaciarlo?`,
      tipo: 'confirmar',
      textoAceptar: 'Vaciar carrito',
      textoCancelar: 'Seguir comprando'
    });
    if (vaciar) actualizarCarrito(0);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarMenu();
  iniciarCarrito();
});
