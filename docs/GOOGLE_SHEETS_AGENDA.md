# Configurar Google Sheets para Agenda y Quiz

Las respuestas de "Agendar llamada" y del quiz se envían al mismo archivo de Google Sheets mediante un **Web App** de Google Apps Script. La pestaña `Agenda` se conserva y el script crea automáticamente otra pestaña llamada `Quiz Leads`.

Tu hoja: [Agenda - Google Sheets](https://docs.google.com/spreadsheets/d/15139Gz9m1dMfoUTVu1mHjPDcjgn0QIGiTV_TVIPDenw/edit?usp=sharing)

---

## 1. Encabezados en tu hoja "Agenda"

1. Abre tu hoja **Agenda** (el enlace de arriba).
2. En la **primera fila**, pon estos encabezados (uno por celda, de la **A1** a la **G1**):

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | Fecha | Nombre | WhatsApp | Tipo de negocio | Qué mejorar | Presupuesto | Día y horario |

   (El script escribe en el orden: Fecha automática, Nombre, WhatsApp, Tipo de negocio, Qué mejorar, Presupuesto, Día y horario.)

---

**Para copiar los encabezados:** en la fila 1 escribe en cada celda: **A1** = Fecha | **B1** = Nombre | **C1** = WhatsApp | **D1** = Tipo de negocio | **E1** = Qué mejorar | **F1** = Presupuesto | **G1** = Día y horario. Opcional: congela la fila 1 (Ver → Congelar → 1 fila).

---

## 2. Actualizar el script que recibe los datos

1. En esa misma hoja "Agenda", menú **Extensiones → Apps Script**.
2. Se abre el editor. Borra el código anterior y pega **todo** el contenido actualizado de `docs/agenda-webapp-code.js`.

3. **Guarda** el proyecto (Ctrl+S o el icono de disco). Ponle nombre al proyecto si quieres, por ejemplo: **"Agenda Web App"**.

---

## 3. Desplegar como Web App

1. En Apps Script:
   - Si ya existe la aplicación web: **Implementar → Administrar implementaciones → Editar (lápiz) → Nueva versión → Implementar**.
   - Si no existe: **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Configuración:
   - **Descripción**: por ejemplo "Agenda llamadas".
   - **Ejecutar como**: **Yo** (tu cuenta de Google).
   - **Quién tiene acceso**: **Cualquier persona** (así tu web puede enviar datos sin login).
4. Pulsa **Implementar**.
5. En **Autorizar el acceso**:
   - Elige tu cuenta de Google.
   - Si sale "Google no ha verificado esta app": **Avanzadas** → **Ir a [nombre del proyecto] (no seguro)** → **Permitir**.
6. Te dará una **URL de la aplicación web**, algo como:
   `https://script.google.com/macros/s/AKfycbz.../exec`
7. **Copia esa URL** completa; la usarás en el paso siguiente.

---

## 4. Poner la URL en tu proyecto

1. En la **raíz** del proyecto (donde está `package.json`), crea un archivo **`.env.local`** (si no existe).
2. Añade esta línea (sustituye la URL por la que te dio Google):

   ```
   GOOGLE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/XXXXXXXX/exec
   ```

3. **Reinicia** el servidor de desarrollo (`npm run dev`) para que lea la variable.
4. Si subes el sitio a **Vercel** (u otro hosting), añade la misma variable en **Settings → Environment Variables**: nombre `GOOGLE_SHEETS_WEBAPP_URL`, valor la URL del script.

---

## 5. Probar que funciona

1. En tu web, haz clic en **"Agendar llamada"**.
2. Rellena el formulario y envía.
3. Revisa la Google Sheet:
   - Agenda crea una fila nueva en la pestaña `Agenda`.
   - El quiz crea una fila en `Quiz Leads`, con `Fecha y hora de registro`, y actualiza esa misma fila conforme la persona avanza.

Si no llega nada:
- Comprueba que la URL en `.env.local` es exactamente la de **Implementar → Implementaciones** (incluido `/exec` al final).
- En Apps Script, **Ver → Registros de ejecución** para ver si hubo errores.

---

## Resumen rápido

| Dónde | Qué hacer |
|-------|-----------|
| Google Sheet | Crear hoja, fila 1 = encabezados (Fecha, Nombre, WhatsApp, Tipo de negocio, Qué mejorar, Presupuesto, Día y horario). |
| Apps Script | Pegar el `doPost` que recibe JSON y hace `appendRow`. |
| Implementar | Nueva implementación → Aplicación web → "Cualquier persona" → Copiar URL. |
| Proyecto | `.env.local`: `GOOGLE_SHEETS_WEBAPP_URL=URL_copiada`. |
| Vercel | Añadir la misma variable en Environment Variables. |

Con esto, cada agenda y cada quiz quedarán registrados en el mismo archivo de Google Sheets.
