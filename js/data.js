// =============================================
// data.js — Integración con Firebase Firestore
// =============================================

import { db, storage } from "./firebase-config.js";
import {
  collection, doc, getDocs,
  setDoc, addDoc, updateDoc, deleteDoc,
  query, where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const COLECCION = "productos";

// ─────────────────────────────────────────────
// DATOS INICIALES
// Rutas corregidas para coincidir con los
// archivos reales en la carpeta /img/
// ─────────────────────────────────────────────
const PRODUCTOS_INICIALES = [
  // ── DETALLES SORPRESA ──────────────────────
  {
    id: "ds-01",
    nombre: "Sonata De Verano",
    slug: "sonata-de-verano",
    categoria: "detalles-sorpresa",
    precio: 98200,
    descripcion: "El equilibrio entre estética y sabor.",
    contenido: [
      "2 sandwich doble jamón premium",
      "1 Porción de papaya",
      "1 granola",
      "1 Yogurth natural",
      "1 tarro de dulces",
      "1 jugo de naranja",
      "1 porción fruta de temporada",
      "Decoración en globos",
      "Bandeja · Mantel · Cubiertos de madera · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/1.jpg",
    galeria: [
      "img/detalles_sorpresa/sonata de verano/1.png",
      "img/detalles_sorpresa/sonata de verano/2.jpg"
    ],
    destacado: true,
    fecha: "2025-01-15"
  },
  {
    id: "ds-02",
    nombre: "Diamante De La Corona",
    slug: "diamante-de-la-corona",
    categoria: "detalles-sorpresa",
    precio: 94900,
    descripcion: "",
    contenido: [
      "2 sandwich doble jamón",
      "1 Porción de papaya",
      "1 granola · 1 Yogurth",
      "1 tarro de dulces",
      "1 jugo de naranja",
      "1 tarro de achiras",
      "1 pieza de luces · 3 fotos",
      "Decoración en globos y moños",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/2.jpg",
    galeria: [
      "img/detalles_sorpresa/diamante de la corona/1.jpg",
      "img/detalles_sorpresa/diamante de la corona/2.jpg"
    ],
    destacado: false,
    fecha: "2025-01-20"
  },
  {
    id: "ds-03",
    nombre: "Desayuno Baúl De Los Recuerdos",
    slug: "desayuno-baul-de-los-recuerdos",
    categoria: "detalles-sorpresa",
    precio: 99900,
    descripcion: "",
    contenido: [
      "2 sandwich",
      "1 Porción papaya · 1 granola · 1 Yogurth",
      "1 tarro dulces · 1 jugo naranja",
      "1 fruta de temporada",
      "1 luces · 3 fotos",
      "Decoración en globos",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/3.jpg",
    galeria: [
      "img/detalles_sorpresa/desayuno ba\u00FAl de los recuerdos/1.jpg",
      "img/detalles_sorpresa/desayuno ba\u00FAl de los recuerdos/2.jpg",
      "img/detalles_sorpresa/desayuno ba\u00FAl de los recuerdos/3.jpg"
    ],
    destacado: false,
    fecha: "2025-02-01"
  },
  {
    id: "ds-04",
    nombre: "Desayuno Hogwarts",
    slug: "desayuno-hogwarts",
    categoria: "detalles-sorpresa",
    precio: 98900,
    descripcion: "",
    contenido: [
      "2 sandwich · 1 papaya · 1 granola",
      "1 Yogurth · 1 tarro dulces",
      "1 jugo naranja · 1 avena",
      "1 luces",
      "Decoración Harry Potter",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/7.jpg",
    galeria: [
      "img/detalles_sorpresa/desayuno hogwarts/1.jpg",
      "img/detalles_sorpresa/desayuno hogwarts/2.jpg",
      "img/detalles_sorpresa/desayuno hogwarts/3.jpg"
    ],
    destacado: true,
    fecha: "2025-04-01"
  },
  {
    id: "ds-05",
    nombre: "Desayuno Deluxe Escandalosos",
    slug: "desayuno-deluxe-escandalosos",
    categoria: "detalles-sorpresa",
    precio: 105000,
    descripcion: "",
    contenido: [
      "2 sandwich doble jamón premium",
      "1 Porción papaya · 1 granola · 1 Yogurth",
      "1 jugo naranja · 1 avena",
      "Decoración especial",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/4.jpg",
    galeria: [
      "img/detalles_sorpresa/desayuno deluxe escandalosos/1.jpg",
      "img/detalles_sorpresa/desayuno deluxe escandalosos/2.jpg",
      "img/detalles_sorpresa/desayuno deluxe escandalosos/3.jpg"
    ],
    destacado: false,
    fecha: "2025-03-01"
  },
  {
    id: "ds-06",
    nombre: "Desayuno La Vie En Rose",
    slug: "desayuno-la-vie-en-rose",
    categoria: "detalles-sorpresa",
    precio: 102000,
    descripcion: "",
    contenido: [
      "2 sandwich · 1 papaya · 1 granola",
      "1 Yogurth · 1 tarro dulces · 1 jugo",
      "Decoración romántica en rosas",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/5.jpg",
    galeria: [
      "img/detalles_sorpresa/desayuno la vie en rosse/1.jpg",
      "img/detalles_sorpresa/desayuno la vie en rosse/2.jpg",
      "img/detalles_sorpresa/desayuno la vie en rosse/3.jpg",
      "img/detalles_sorpresa/desayuno la vie en rosse/4.jpg"
    ],
    destacado: false,
    fecha: "2025-03-10"
  },
  {
    id: "ds-07",
    nombre: "Desayuno Mañanas Livianas",
    slug: "desayuno-mananas-livianas",
    categoria: "detalles-sorpresa",
    precio: 89900,
    descripcion: "",
    contenido: [
      "2 sandwich · 1 papaya · 1 granola",
      "1 Yogurth · 1 jugo naranja",
      "1 fruta de temporada",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/6.jpg",
    galeria: [
      "img/detalles_sorpresa/desayuno ma\u00F1anas livianas/1.jpg",
      "img/detalles_sorpresa/desayuno ma\u00F1anas livianas/2.jpg",
      "img/detalles_sorpresa/desayuno ma\u00F1anas livianas/3.jpg",
      "img/detalles_sorpresa/desayuno ma\u00F1anas livianas/4.jpg"
    ],
    destacado: false,
    fecha: "2025-03-15"
  },
  {
    id: "ds-08",
    nombre: "Desayuno Tazas Buen Día",
    slug: "desayuno-tazas-buen-dia",
    categoria: "detalles-sorpresa",
    precio: 97000,
    descripcion: "",
    contenido: [
      "2 sandwich · 1 papaya · 1 granola",
      "1 Yogurth · 1 tarro dulces · 1 jugo",
      "Taza personalizada",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/8.jpg",
    galeria: [
      "img/detalles_sorpresa/desayuno tazas buen dia/1.jpg",
      "img/detalles_sorpresa/desayuno tazas buen dia/2.jpg",
      "img/detalles_sorpresa/desayuno tazas buen dia/3.jpg"
    ],
    destacado: false,
    fecha: "2025-03-20"
  },
  {
    id: "ds-09",
    nombre: "Desayuno Tercer Nivel",
    slug: "desayuno-tercer-nivel",
    categoria: "detalles-sorpresa",
    precio: 115000,
    descripcion: "",
    contenido: [
      "2 sandwich doble jamón premium",
      "1 papaya · 1 granola · 1 Yogurth",
      "1 tarro dulces · 1 jugo naranja",
      "1 avena · 1 fruta temporada",
      "1 luces · 3 fotos",
      "Decoración premium",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/9.jpg",
    galeria: [
      "img/detalles_sorpresa/desayuno tercer nivel/1.jpg",
      "img/detalles_sorpresa/desayuno tercer nivel/2.jpg",
      "img/detalles_sorpresa/desayuno tercer nivel/3.jpg",
      "img/detalles_sorpresa/desayuno tercer nivel/4.jpg",
      "img/detalles_sorpresa/desayuno tercer nivel/5.jpg",
      "img/detalles_sorpresa/desayuno tercer nivel/6.jpg"
    ],
    destacado: true,
    fecha: "2025-04-05"
  },
  {
    id: "ds-10",
    nombre: "Desayuno Álbum Fotográfico",
    slug: "desayuno-album-fotografico",
    categoria: "detalles-sorpresa",
    precio: 108000,
    descripcion: "",
    contenido: [
      "2 sandwich · 1 papaya · 1 granola · 1 Yogurth",
      "1 tarro dulces · 1 jugo · 1 avena",
      "Álbum fotográfico personalizado",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/10.jpg",
    galeria: [
      "img/detalles_sorpresa/desayuno \u00E1lbum fotografico/1.jpg",
      "img/detalles_sorpresa/desayuno \u00E1lbum fotografico/2.jpg",
      "img/detalles_sorpresa/desayuno \u00E1lbum fotografico/3.jpg"
    ],
    destacado: false,
    fecha: "2025-04-10"
  },
  {
    id: "ds-11",
    nombre: "Desayuno Infantil Recuerditos",
    slug: "desayuno-infantil-recuerditos",
    categoria: "detalles-sorpresa",
    precio: 92000,
    descripcion: "",
    contenido: [
      "2 sandwich · 1 papaya · 1 granola",
      "1 Yogurth · 1 tarro dulces · 1 jugo",
      "Decoración infantil temática",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/11.jpg",
    galeria: [
      "img/detalles_sorpresa/desayuno infantil recuerditos/1.jpg",
      "img/detalles_sorpresa/desayuno infantil recuerditos/2.jpg"
    ],
    destacado: false,
    fecha: "2025-04-15"
  },
  {
    id: "ds-12",
    nombre: "Sueña En Rosa",
    slug: "suena-en-rosa",
    categoria: "detalles-sorpresa",
    precio: 101000,
    descripcion: "",
    contenido: [
      "2 sandwich · 1 papaya · 1 granola",
      "1 Yogurth · 1 tarro dulces · 1 jugo",
      "Decoración en tonos rosados",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/12.jpg",
    galeria: [
      "img/detalles_sorpresa/sue\u00F1a en rosa/1.jpg",
      "img/detalles_sorpresa/sue\u00F1a en rosa/2.jpg",
      "img/detalles_sorpresa/sue\u00F1a en rosa/3.jpg",
      "img/detalles_sorpresa/sue\u00F1a en rosa/4.jpg",
      "img/detalles_sorpresa/sue\u00F1a en rosa/5.jpg",
      "img/detalles_sorpresa/sue\u00F1a en rosa/6.jpg"
    ],
    destacado: false,
    fecha: "2025-04-20"
  },
  {
    id: "ds-13",
    nombre: "El Cajón De La Abuela",
    slug: "el-cajon-de-la-abuela",
    categoria: "detalles-sorpresa",
    precio: 96000,
    descripcion: "",
    contenido: [
      "2 sandwich · 1 papaya · 1 granola",
      "1 Yogurth · 1 tarro dulces · 1 jugo",
      "Cajón decorativo de madera",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/13.jpg",
    galeria: [
      "img/detalles_sorpresa/el caj\u00F3n de la abuela/1.jpg",
      "img/detalles_sorpresa/el caj\u00F3n de la abuela/2.jpg",
      "img/detalles_sorpresa/el caj\u00F3n de la abuela/3.jpg"
    ],
    destacado: false,
    fecha: "2025-04-25"
  },
  {
    id: "ds-14",
    nombre: "Regreso Escalera Al Éxito",
    slug: "regreso-escalera-al-exito",
    categoria: "detalles-sorpresa",
    precio: 99000,
    descripcion: "",
    contenido: [
      "2 sandwich doble jamón premium",
      "1 papaya · 1 granola · 1 Yogurth",
      "1 tarro dulces · 1 jugo · 1 avena",
      "Decoración motivacional",
      "Bandeja · Mantel · Cubiertos · Pitillo"
    ],
    imagen: "img/detalles_sorpresa/14.jpg",
    galeria: [
      "img/detalles_sorpresa/regreso escalera al exito/1.jpg"
    ],
    destacado: false,
    fecha: "2025-05-01"
  },

  // ── FRESAS CON CHOCOLATE ───────────────────
  {
    id: "fc-01",
    nombre: "Rosas Rosé",
    slug: "rosas-rose",
    categoria: "fresas-con-chocolate",
    precio: 110000,
    descripcion: "Fresas con chocolate tipo exportación bañadas en chocolate rosa, ciruelas y decoración floral.",
    contenido: [
      "Fresas tipo exportación",
      "Chocolate belga rosa",
      "Ciruelas",
      "Decoración floral"
    ],
    imagen: "img/fresas-con-chocolate/1.jpg",
    galeria: [
      "img/fresas-con-chocolate/rosas-rose/1.jpg",
      "img/fresas-con-chocolate/rosas-rose/2.jpg",
      "img/fresas-con-chocolate/rosas-rose/3.jpg"
    ],
    destacado: true,
    fecha: "2025-05-10"
  },
  {
    id: "fc-02",
    nombre: "Gold & Roses",
    slug: "gold-and-roses",
    categoria: "fresas-con-chocolate",
    precio: 125000,
    descripcion: "Fresas con chocolate dorado y rosas naturales.",
    contenido: [
      "Fresas tipo exportación",
      "Chocolate belga dorado",
      "Rosas naturales",
      "Decoración premium"
    ],
    imagen: "img/fresas-con-chocolate/2.jpg",
    galeria: [
      "img/fresas-con-chocolate/gold-and-roses/1.jpg",
      "img/fresas-con-chocolate/gold-and-roses/2.jpg",
      "img/fresas-con-chocolate/gold-and-roses/3.jpg"
    ],
    destacado: true,
    fecha: "2025-05-12"
  },
  {
    id: "fc-03",
    nombre: "Nivel Versace",
    slug: "nivel-versace",
    categoria: "fresas-con-chocolate",
    precio: 135000,
    descripcion: "La presentación más lujosa de fresas con chocolate.",
    contenido: [
      "Fresas tipo exportación",
      "Chocolate belga negro y blanco",
      "Decoración de lujo",
      "Caja premium"
    ],
    imagen: "img/fresas-con-chocolate/3.jpg",
    galeria: [
      "img/fresas-con-chocolate/nivel-versace/1.jpg",
      "img/fresas-con-chocolate/nivel-versace/2.jpg"
    ],
    destacado: false,
    fecha: "2025-05-14"
  },
  {
    id: "fc-04",
    nombre: "Harry In The Garden",
    slug: "harry-in-the-garden",
    categoria: "fresas-con-chocolate",
    precio: 115000,
    descripcion: "Fresas con chocolate temáticas de Harry Potter.",
    contenido: [
      "Fresas tipo exportación",
      "Chocolate belga",
      "Decoración temática Harry Potter",
      "Caja decorada"
    ],
    imagen: "img/fresas-con-chocolate/4.jpg",
    galeria: [
      "img/fresas-con-chocolate/harry-in-the-garden/1.jpg",
      "img/fresas-con-chocolate/harry-in-the-garden/2.jpg",
      "img/fresas-con-chocolate/harry-in-the-garden/3.jpg",
      "img/fresas-con-chocolate/harry-in-the-garden/4.jpg"
    ],
    destacado: false,
    fecha: "2025-05-16"
  },
  {
    id: "fc-05",
    nombre: "Caja De Pandora Elite",
    slug: "caja-de-pandora-elite",
    categoria: "fresas-con-chocolate",
    precio: 145000,
    descripcion: "La experiencia definitiva de fresas con chocolate en caja de lujo.",
    contenido: [
      "Fresas tipo exportación premium",
      "Chocolate belga 3 sabores",
      "Caja de lujo decorada",
      "Flores secas decorativas"
    ],
    imagen: "img/fresas-con-chocolate/5.jpg",
    galeria: [
      "img/fresas-con-chocolate/caja-de-pandora-elite/1.jpg",
      "img/fresas-con-chocolate/caja-de-pandora-elite/2.jpg",
      "img/fresas-con-chocolate/caja-de-pandora-elite/3.jpg"
    ],
    destacado: true,
    fecha: "2025-05-18"
  }
];

// ─────────────────────────────────────────────
// INICIALIZAR (solo si Firestore está vacío)
// ─────────────────────────────────────────────
export async function inicializarDatos() {
  const snap = await getDocs(collection(db, COLECCION));
  if (snap.empty) {
    console.log("Firestore vacío → cargando productos iniciales...");
    for (const p of PRODUCTOS_INICIALES) {
      await setDoc(doc(db, COLECCION, p.id), p);
    }
    console.log(`${PRODUCTOS_INICIALES.length} productos cargados.`);
  }
}

// ─────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────
export async function obtenerProductos() {
  const snap = await getDocs(collection(db, COLECCION));
  return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

export async function obtenerProductoPorSlug(slug) {
  const q = query(collection(db, COLECCION), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { ...d.data(), id: d.id };
}

export async function obtenerProductosPorCategoria(categoria) {
  const q = query(collection(db, COLECCION), where("categoria", "==", categoria));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

export async function obtenerProductosDestacados() {
  const q = query(collection(db, COLECCION), where("destacado", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

export async function crearProducto(producto) {
  const r = await addDoc(collection(db, COLECCION), {
    ...producto,
    fecha: new Date().toISOString().split("T")[0]
  });
  return r.id;
}

export async function actualizarProducto(id, datos) {
  await updateDoc(doc(db, COLECCION, id), datos);
}

export async function eliminarProducto(id) {
  await deleteDoc(doc(db, COLECCION, id));
}

// ─────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────
export async function subirImagen(file, carpeta = "productos") {
  const nombre = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const storageRef = ref(storage, `${carpeta}/${nombre}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

export async function eliminarImagen(url) {
  try {
    await deleteObject(ref(storage, url));
  } catch (e) {
    console.warn("No se pudo eliminar la imagen:", e.message);
  }
}

// ─────────────────────────────────────────────
// UTILIDADES
// ─────────────────────────────────────────────
export function formatearPrecio(precio) {
  return "$" + Number(precio).toLocaleString("es-CO");
}

export async function exportarDatos() {
  const productos = await obtenerProductos();
  return JSON.stringify(productos, null, 2);
}

export async function importarDatos(jsonString) {
  try {
    const productos = JSON.parse(jsonString);
    for (const p of productos) {
      const id = String(p.id);
      await setDoc(doc(db, COLECCION, id), { ...p, id });
    }
    return true;
  } catch (e) {
    console.error("Error al importar:", e);
    return false;
  }
}

// ─────────────────────────────────────────────
// CONFIGURACIÓN DEL NEGOCIO
// (número WA, estado abierto/cerrado, hero, etc.)
// ─────────────────────────────────────────────
const COL_CONFIG = "config";

const CONFIG_DEFAULTS = {
  whatsapp:       "573146377283",
  negocioAbierto: true,
  mensajeCerrado: "Hoy no estamos disponibles. Escríbenos y te atendemos pronto 🌸",
  horario:        "Lunes a Sábado · 7am – 6pm",
  heroTitulo1:    "Momentos",
  heroTitulo2:    "Inolvidables",
  heroSubtitulo:  "Desayunos sorpresa, arreglos florales y detalles únicos entregados con amor a quien más quieres.",
  heroEyebrow:    "Bogotá, Colombia",
};

export async function obtenerConfig() {
  try {
    const snap = await getDocs(collection(db, COL_CONFIG));
    if (snap.empty) {
      await setDoc(doc(db, COL_CONFIG, "general"), CONFIG_DEFAULTS);
      return { ...CONFIG_DEFAULTS };
    }
    const data = {};
    snap.docs.forEach(d => Object.assign(data, d.data()));
    return { ...CONFIG_DEFAULTS, ...data };
  } catch(e) {
    console.warn("Config fallback:", e.message);
    return { ...CONFIG_DEFAULTS };
  }
}

export async function guardarConfig(datos) {
  await setDoc(doc(db, COL_CONFIG, "general"), datos, { merge: true });
}

// ─────────────────────────────────────────────
// RESEÑAS DE CLIENTES
// ─────────────────────────────────────────────
const COL_RESENAS = "resenas";

export async function obtenerResenas() {
  const snap = await getDocs(collection(db, COL_RESENAS));
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
    .sort((a, b) => (b.orden || 0) - (a.orden || 0));
}

export async function crearResena(resena) {
  const r = await addDoc(collection(db, COL_RESENAS), {
    ...resena,
    fecha: new Date().toISOString().split("T")[0]
  });
  return r.id;
}

export async function actualizarResena(id, datos) {
  await updateDoc(doc(db, COL_RESENAS, id), datos);
}

export async function eliminarResena(id) {
  await deleteDoc(doc(db, COL_RESENAS, id));
}

// ─────────────────────────────────────────────
// ORDEN DE PRODUCTOS EN CARRUSEL
// ─────────────────────────────────────────────
export async function actualizarOrden(id, orden) {
  await updateDoc(doc(db, COLECCION, id), { orden: Number(orden) });
}

// Obtener productos por categoría ORDENADOS
export async function obtenerProductosPorCategoriaOrdenados(categoria) {
  const q = query(collection(db, COLECCION), where("categoria", "==", categoria));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ ...d.data(), id: d.id }))
    .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999));
}

// ─────────────────────────────────────────────
// SEO DINÁMICO POR PRODUCTO
// ─────────────────────────────────────────────
export function aplicarSEO({ titulo, descripcion, imagen, url }) {
  document.title = titulo;
  const setMeta = (sel, val) => {
    let el = document.querySelector(sel);
    if (!el) { el = document.createElement('meta'); document.head.appendChild(el); }
    el.setAttribute('content', val);
  };
  setMeta('meta[name="description"]', descripcion);
  setMeta('meta[property="og:title"]', titulo);
  setMeta('meta[property="og:description"]', descripcion);
  if (imagen) setMeta('meta[property="og:image"]', imagen);
  if (url)    setMeta('meta[property="og:url"]', url);
}
