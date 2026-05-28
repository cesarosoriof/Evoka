// =============================================
// SCRIPT.JS – Utilidades globales Évoka
// =============================================

// ── Escape HTML (seguridad XSS) ──────────────
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ── WhatsApp ──────────────────────────────────
function comprarPorWhatsapp(nombre) {
    const numero = '573146377283';
    const msg    = `Hola, quiero pedir: *${nombre}*`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Exponer globalmente para onclick en HTML generado dinámicamente
window.escHtml           = escHtml;
window.comprarPorWhatsapp = comprarPorWhatsapp;
