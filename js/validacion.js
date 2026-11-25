/*
 * validacion.js
 * Validación de formularios hecha a mano (sin los tooltips del navegador).
 * Los formularios llevan "novalidate" en el HTML para desactivar los avisos nativos.
 *
 * Funcionamiento:
 *  - Cada campo tiene una función que devuelve un mensaje de error o "" si está bien.
 *  - Al salir del campo (blur) se valida por primera vez.
 *  - A partir de ahí se valida en cada tecla (input), así el usuario ve
 *    cómo desaparece el error mientras lo corrige, pero no le salta
 *    un error rojo nada más empezar a escribir.
 */

/* ---------- Funciones de validación reutilizables ---------- */

const regexEmail = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const regexNombre = /^[a-záéíóúüñ' -]+$/i;
const regexTelefono = /^(\+34\s?)?[6789]\d{2}\s?\d{3}\s?\d{3}$/;

function validarNombre(valor) {
  const v = valor.trim();
  if (v === '') return 'Escribe tu nombre.';
  if (v.length < 3) return 'El nombre es demasiado corto.';
  if (!regexNombre.test(v)) return 'El nombre solo puede tener letras y espacios.';
  if (v.split(/\s+/).length < 2) return 'Pon también al menos un apellido.';
  return '';
}

function validarEmail(valor) {
  const v = valor.trim();
  if (v === '') return 'El email es obligatorio.';
  if (!v.includes('@')) return 'Al email le falta la @.';
  if (!regexEmail.test(v)) return 'Ese email no parece válido (ej. hola@ejemplo.com).';
  return '';
}

function validarTelefono(valor) {
  const v = valor.trim();
  if (v === '') return ''; // es opcional
  if (!regexTelefono.test(v)) return 'Usa un móvil o fijo español, ej. +34 600 000 000.';
  return '';
}

function validarPasswordLogin(valor) {
  if (valor === '') return 'Escribe tu contraseña.';
  if (valor.length < 8) return 'La contraseña tiene al menos 8 caracteres.';
  return '';
}

function validarPasswordNueva(valor) {
  if (valor === '') return 'Elige una contraseña.';
  if (valor.length < 8) return `Faltan ${8 - valor.length} caracteres (mínimo 8).`;
  if (!/[A-Z]/.test(valor)) return 'Añade al menos una mayúscula.';
  if (!/[0-9]/.test(valor)) return 'Añade al menos un número.';
  if (/\s/.test(valor)) return 'La contraseña no puede tener espacios.';
  return '';
}

/* Puntuación de 0 a 4 para la barra de seguridad */
function fuerzaPassword(valor) {
  let puntos = 0;
  if (valor.length >= 8) puntos++;
  if (/[A-Z]/.test(valor) && /[a-z]/.test(valor)) puntos++;
  if (/[0-9]/.test(valor)) puntos++;
  if (/[^A-Za-z0-9]/.test(valor) || valor.length >= 12) puntos++;
  return puntos;
}

/* Convierte "2025-03-14" en una fecha local (sin problemas de zona horaria) */
function leerFecha(valor) {
  const [a, m, d] = valor.split('-').map(Number);
  return new Date(a, m - 1, d);
}

/* Fecha local en formato AAAA-MM-DD (toISOString usa UTC y de madrugada daría el día anterior) */
function fechaISO(fecha) {
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${m}-${d}`;
}

function hoySinHora() {
  const h = new Date();
  return new Date(h.getFullYear(), h.getMonth(), h.getDate());
}

function validarNacimiento(valor) {
  if (valor === '') return 'Indica tu fecha de nacimiento.';
  const fecha = leerFecha(valor);
  if (isNaN(fecha)) return 'La fecha no es válida.';
  const hoy = hoySinHora();
  if (fecha > hoy) return 'La fecha no puede ser futura.';
  if (fecha.getFullYear() < 1900) return 'Revisa el año, parece incorrecto.';

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < fecha.getMonth() ||
    (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate());
  if (aunNoCumple) edad--;
  if (edad < 18) return 'Tienes que ser mayor de 18 años para registrarte.';
  return '';
}

function validarFechaLanzamiento(valor) {
  if (valor === '') return 'Elige el día en que sale el objeto.';
  const fecha = leerFecha(valor);
  if (isNaN(fecha)) return 'La fecha no es válida.';
  const hoy = hoySinHora();
  if (fecha < hoy) return 'La fecha de lanzamiento no puede ser anterior a hoy.';
  const limite = new Date(hoy);
  limite.setFullYear(limite.getFullYear() + 1);
  if (fecha > limite) return 'Solo se puede programar con un año de antelación como máximo.';
  return '';
}

/* ---------- Motor de validación ---------- */

/* Crea (si no existe) el párrafo de error debajo del campo */
function obtenerCajaError(input) {
  const contenedor = input.closest('.field');
  let caja = contenedor.querySelector('.error-msg');
  if (!caja) {
    caja = document.createElement('p');
    caja.className = 'error-msg';
    caja.id = `error-${input.id}`;
    caja.setAttribute('aria-live', 'polite');
    contenedor.appendChild(caja);
    // Así el lector de pantalla lee el error al llegar al campo
    const previo = input.getAttribute('aria-describedby');
    input.setAttribute('aria-describedby', previo ? `${previo} ${caja.id}` : caja.id);
  }
  return caja;
}

function mostrarEstado(input, mensaje) {
  const contenedor = input.closest('.field');
  const caja = obtenerCajaError(input);
  caja.textContent = mensaje;
  contenedor.classList.toggle('invalido', mensaje !== '');
  contenedor.classList.toggle('valido', mensaje === '' && input.value.trim() !== '');
  input.setAttribute('aria-invalid', mensaje !== '' ? 'true' : 'false');
}

/*
 * configurarFormulario(form, reglas, alEnviar)
 * reglas: { idDelCampo: funcionQueDevuelveError }
 * alEnviar: función que se ejecuta solo si todo es correcto
 */
function configurarFormulario(form, reglas, alEnviar) {
  const tocados = new Set();

  function validarCampo(id) {
    const input = form.querySelector(`#${id}`);
    const mensaje = reglas[id](input.value, input);
    mostrarEstado(input, mensaje);
    return mensaje === '';
  }

  Object.keys(reglas).forEach(id => {
    const input = form.querySelector(`#${id}`);
    const evento = input.type === 'file' || input.tagName === 'SELECT' ? 'change' : 'input';

    input.addEventListener('blur', () => {
      tocados.add(id);
      validarCampo(id);
    });

    input.addEventListener(evento, () => {
      if (tocados.has(id) || evento === 'change') {
        tocados.add(id);
        validarCampo(id);
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const errorGeneral = form.querySelector('.error-form');
    if (errorGeneral) errorGeneral.hidden = true;

    let primerError = null;
    Object.keys(reglas).forEach(id => {
      tocados.add(id);
      const ok = validarCampo(id);
      if (!ok && !primerError) primerError = form.querySelector(`#${id}`);
    });

    if (primerError) {
      primerError.focus();
      return;
    }
    alEnviar(form);
  });

  // Devuelvo la función por si otra parte del código necesita revalidar un campo
  return { validarCampo };
}
