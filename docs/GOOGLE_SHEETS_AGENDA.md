# Configurar Google Sheets para Agenda y Quiz

Las solicitudes de **"Hablar con Komvos"** y el quiz se envían al mismo Google Sheets mediante un **Web App** de Google Apps Script.

Tu hoja: [Agenda - Google Sheets](https://docs.google.com/spreadsheets/d/15139Gz9m1dMfoUTVu1mHjPDcjgn0QIGiTV_TVIPDenw/edit?usp=sharing)

---

## 1. Encabezados en tu hoja "Agenda"

1. Abre tu hoja **Agenda**.
2. En la **primera fila**, deja solo estas columnas (A1–E1). **Borra** Tipo de negocio, Qué mejorar, Presupuesto u otras columnas viejas:

   | A | B | C | D | E |
   |---|---|---|---|---|
   | Fecha de solicitud | Día seleccionado | Nombre | WhatsApp | Horario |

3. Congela la fila 1 (Ver → Congelar → 1 fila).

Al enviar una solicitud se guarda:
- **Fecha de solicitud** (automática al dar clic en Enviar)
- **Día seleccionado**
- **Nombre**
- **WhatsApp**
- **Horario**

---

## 2. Actualizar el script

1. En la hoja: **Extensiones → Apps Script**.
2. Borra el código anterior y pega **todo** el contenido de `docs/agenda-webapp-code.js`.
3. **Guarda** (Ctrl+S).

---

## 3. Desplegar como Web App

1. **Implementar → Administrar implementaciones → Editar (lápiz) → Nueva versión → Implementar**  
   (o **Nueva implementación** si aún no existe).
2. Tipo: **Aplicación web**.
3. Ejecutar como: **Yo** · Acceso: **Cualquier persona**.
4. Autoriza y copia la URL `.../exec`.

---

## 4. Variable en el proyecto

En `.env.local`:

```
GOOGLE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/XXXXXXXX/exec
```

Reinicia `npm run dev`. En Vercel/Hostinger añade la misma variable.

---

## 5. Probar

1. Clic en **Hablar con Komvos**.
2. Elige día, horario, nombre y WhatsApp → **Enviar solicitud**.
3. Debe aparecer una fila nueva solo con esas columnas.
4. Vuelve a abrir el modal en el mismo día: ese horario debe verse **ocupado** (tachado / deshabilitado).

Si no llega nada: revisa la URL en `.env.local` y **Ver → Registros de ejecución** en Apps Script.
