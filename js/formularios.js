/*
 * formularios.js
 * Conecta cada formulario de la web con sus reglas de validacion.js.
 * Se detecta qué formulario hay en la página por su id.
 */

/* ---------- LOGIN ---------- */
const formLogin = document.getElementById('form-login');
if (formLogin) {
  configurarFormulario(formLogin, {
    email: validarEmail,
    pass: validarPasswordLogin
  }, form => {
    const email = form.email.value.trim().toLowerCase();
    const pass = form.pass.value;
    const usuario = usuarios.find(u => u.email === email && u.password === pass);

    if (!usuario) {
      // Error general del formulario, también en el DOM
      const error = form.querySelector('.error-form');
      error.textContent = 'El email o la contraseña no son correctos.';
      error.hidden = false;
      return;
    }
    abrirModal({
      titulo: `Hola de nuevo, ${usuario.nombre.split(' ')[0]}`,
      texto: 'Sesión iniciada. Te llevamos al catálogo.',
      textoAceptar: 'Entrar'
    }).then(() => { location.href = 'index.html'; });
  });
}

/* ---------- REGISTRO ---------- */
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
  const pass = document.getElementById('pass');
  const barra = document.getElementById('fuerza');
  const textoFuerza = document.getElementById('fuerza-texto');
  const niveles = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Muy segura'];

  const validador = configurarFormulario(formRegistro, {
    nombre: validarNombre,
    email: validarEmail,
    tel: validarTelefono,
    nacimiento: validarNacimiento,
    pass: validarPasswordNueva,
    pass2: valor => {
      if (valor === '') return 'Repite la contraseña.';
      if (valor !== pass.value) return 'Las contraseñas no coinciden.';
      return '';
    },
    terminos: (valor, input) => input.checked ? '' : 'Tienes que aceptar los términos para continuar.'
  }, form => {
    abrirModal({
      titulo: 'Cuenta creada',
      texto: `Bienvenido/a a PARA//LELO, ${form.nombre.value.trim().split(' ')[0]}. Ya puedes explorar el drop.`,
      textoAceptar: 'Ir al catálogo'
    }).then(() => { location.href = 'index.html'; });
  });

  // Barra de seguridad de la contraseña, se actualiza al escribir
  pass.addEventListener('input', () => {
    const puntos = pass.value === '' ? 0 : fuerzaPassword(pass.value);
    barra.dataset.nivel = puntos;
    textoFuerza.textContent = pass.value === '' ? '' : niveles[puntos];
    // Si ya se había escrito la repetición, se vuelve a comprobar
    if (document.getElementById('pass2').value !== '') validador.validarCampo('pass2');
  });

  // El checkbox se valida al marcarlo/desmarcarlo
  document.getElementById('terminos').addEventListener('change', () => validador.validarCampo('terminos'));

  // Fecha máxima en el calendario = hoy
  document.getElementById('nacimiento').max = fechaISO(new Date());
}

/* ---------- PUBLICAR OBJETO ---------- */
const formCrear = document.getElementById('form-crear');
if (formCrear) {
  const desc = document.getElementById('desc');
  const contador = document.getElementById('c');
  const inputImg = document.getElementById('imagenes');
  const listaImg = document.getElementById('lista-imagenes');

  configurarFormulario(formCrear, {
    imagenes: (valor, input) => {
      if (input.files.length === 0) return 'Sube al menos una imagen del objeto.';
      if (input.files.length > 5) return 'Puedes subir como máximo 5 imágenes.';
      for (const f of input.files) {
        if (!['image/jpeg', 'image/png'].includes(f.type)) return `"${f.name}" no es JPG ni PNG.`;
        if (f.size > 10 * 1024 * 1024) return `"${f.name}" pesa más de 10 MB.`;
      }
      return '';
    },
    nombre: valor => {
      const v = valor.trim();
      if (v === '') return 'Ponle un nombre al objeto.';
      if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
      if (v.length > 40) return 'Máximo 40 caracteres.';
      if (productos.some(p => p.nombre.toLowerCase() === v.toLowerCase())) return 'Ya hay un objeto publicado con ese nombre.';
      return '';
    },
    cat: valor => valor === '' ? 'Elige una categoría.' : '',
    desc: valor => {
      const v = valor.trim();
      if (v === '') return 'Cuenta algo sobre el objeto.';
      if (v.length < 20) return `Escribe un poco más (${v.length}/20 caracteres mínimo).`;
      return '';
    },
    precio: valor => {
      if (valor === '') return 'Indica un precio.';
      const n = Number(valor);
      if (isNaN(n) || n <= 0) return 'El precio tiene que ser mayor que 0.';
      if (!/^\d+(\.\d{1,2})?$/.test(valor)) return 'Máximo dos decimales (ej. 49.99).';
      if (n > 10000) return 'El precio máximo es de 10.000 €.';
      return '';
    },
    stock: valor => {
      if (valor === '') return 'Indica cuántas unidades tienes.';
      if (!Number.isInteger(Number(valor)) || Number(valor) < 1) return 'El stock debe ser un número entero, mínimo 1.';
      if (Number(valor) > 500) return 'Para más de 500 unidades contacta con nosotros.';
      return '';
    },
    lanzamiento: validarFechaLanzamiento
  }, async form => {
    const ok = await abrirModal({
      titulo: '¿Publicar objeto?',
      texto: `"${form.nombre.value.trim()}" saldrá a la venta el ${leerFecha(form.lanzamiento.value).toLocaleDateString('es-ES')} por €${Number(form.precio.value).toFixed(2)}.`,
      tipo: 'confirmar',
      textoAceptar: 'Publicar',
      textoCancelar: 'Revisar'
    });
    if (!ok) return;
    await abrirModal({
      titulo: 'Objeto publicado',
      texto: 'Tu objeto ya está en revisión. Te avisaremos cuando aparezca en el drop.'
    });
    location.href = 'index.html';
  });

  // Contador de caracteres (antes era un oninput en el HTML)
  desc.addEventListener('input', () => {
    contador.textContent = `${desc.value.length}/240`;
  });

  // Lista con los nombres de las imágenes elegidas
  inputImg.addEventListener('change', () => {
    listaImg.replaceChildren(...[...inputImg.files].map(f => {
      const li = document.createElement('li');
      li.textContent = `${f.name} · ${(f.size / 1024).toFixed(0)} KB`;
      return li;
    }));
  });

  // Rango del calendario: de hoy a un año vista
  const hoy = new Date();
  const enUnAno = new Date(hoy); enUnAno.setFullYear(hoy.getFullYear() + 1);
  const lanzamiento = document.getElementById('lanzamiento');
  lanzamiento.min = fechaISO(hoy);
  lanzamiento.max = fechaISO(enUnAno);
}
