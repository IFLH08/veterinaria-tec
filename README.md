# 🐾 Clínica Veterinaria TEC — Plataforma Web

Landing page comercial, moderna y responsiva desarrollada para **Clínica Veterinaria TEC**, establecimiento de salud animal ubicado en la zona de **DistritoTec / Col. Alta Vista**, Monterrey, N.L.

---

## 🎯 Objetivo del Proyecto

Demostración de desarrollo con arquitectura **Multiagente**:
1. **Investigación de Mercado & Extracción de Datos:** Realizado por **Gemini 3.8 Flash High** para identificar una PyME local con datos de contacto (teléfono y correo) sin sitio web propio activo.
2. **Desarrollo Web Frontend:** Delegado a **Codex Sol 6.1 Mid** para maquetar una experiencia web responsiva, optimizada y enfocada en conversión directa vía WhatsApp y llamada telefónica.

---

## 🏥 Datos del Negocio

* **Nombre:** Clínica Veterinaria TEC
* **Ubicación:** Av. Eugenio Garza Sada Sur 2804, Col. Alta Vista, Monterrey, N.L., CP 64840 *(frente al Campus Monterrey del Tec de Monterrey)*
* **Teléfono Principal:** `(81) 8358-4949`
* **WhatsApp / Citas:** `(81) 1518-9134`
* **Correo de Contacto:** `pepetec62@hotmail.com`
* **Director Técnico:** MVZ José Gerardo Hernández Alanís
* **Horarios:** Lun–Vie 9:00 a 19:30 | Sáb 9:00 a 16:00

---

## 🚀 Características de la Plataforma

* **Hero con CTA Directo:** Botón de llamada inmediata y enlace directo a WhatsApp.
* **Catálogo de 6 Servicios:** Consultas, Vacunación, Cirugías, Urgencias, Estética y Nutrición.
* **Sección de Confianza:** Destaca la trayectoria del MVZ José Gerardo Hernández y la cercanía con la comunidad universitaria.
* **Horarios y Ubicación en Mapa:** Integración con Google Maps para fácil localización.
* **Formulario Interactivo:** Genera automáticamente el mensaje estructurado de solicitud de cita para enviarlo con un clic al WhatsApp de la clínica.

---

## 🛡️ Pipeline CI/CD Automatizado (`.github/workflows/ci.yml`)

El repositorio cuenta con validación continua en cada `push` y `pull_request`:

1. **Auditoría de Seguridad y Secretos (`security-audit`):**
   * Escaneo contra fugas de credenciales, llaves API (OpenAI, AWS, Google, GitHub tokens), contraseñas y archivos `.env` mediante `scripts/audit.js` y `TruffleHog`.
2. **Validación de Redundancia y Optimización (`code-quality`):**
   * Detección de duplicación y código redundante con `jscpd`.
   * Validación semántica y sintáctica de HTML con `HTMLHint`.
   * Presupuesto de peso ligero (< 250 KB) y optimización de carga diferida (`loading="lazy"`).
3. **Despliegue Continuo (`deploy-pages`):**
   * Publicación automática en **GitHub Pages**.

---

## 💻 Pruebas Locales

Para ejecutar las auditorías de calidad y seguridad en tu entorno local:

```bash
# Ejecutar auditoría de seguridad y optimización
node scripts/audit.js

# O mediante npm:
npm test
```

---

## 📄 Licencia

MIT © Ian Leon. Desarrollado con propósitos de demostración y propuesta comercial.
