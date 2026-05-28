// =====================================
// UTILIDADES GENERALES
// =====================================

/**
 * Escapa caracteres HTML para prevenir XSS
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * Genera un slug a partir de un nombre
 */
function generarSlug(texto) {
  return texto
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Muestra una notificación toast
 */
function mostrarToast(mensaje, tipo = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-hidden');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Valida que una URL parezca de imagen
 */
function esURLImagen(url) {
  return /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(url) || url.startsWith('data:image/');
}