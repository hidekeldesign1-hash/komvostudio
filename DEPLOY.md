# Guía: Subir a GitHub y desplegar en Vercel (Komvos)

Sigue estos pasos en orden. Todo lo que debes hacer tú está marcado como **TÚ**.

---

## Parte 1: Preparar el proyecto (ya está hecho)

- [x] El proyecto tiene `.gitignore` correcto (no se suben `node_modules`, `.next`, etc.).
- [x] Los scripts `build`, `start` y `dev` están en `package.json`.
- [x] El build de Next.js funciona (`npm run build`).
- [x] El sitio está listo para Vercel (Next.js con API routes para el formulario "Agendar llamada").

No necesitas cambiar nada en el código para GitHub. **En Vercel sí debes añadir la variable de entorno** (ver más abajo).

---

## Parte 2: GitHub

### Paso 0: Tener Git instalado (si no lo tienes)

Para subir a GitHub necesitas **Git** en tu PC. Si al hacer el Paso 3 te sale *"git no se reconoce"*, instálalo así:

1. Entra en **https://git-scm.com/download/win** y descarga **Git for Windows**.
2. Ejecuta el instalador y avanza con **Next** (puedes dejar las opciones por defecto).
3. En la pantalla **"Adjusting your PATH environment"** elige **"Git from the command line and also from 3rd-party software"** y sigue.
4. Al terminar, **cierra Cursor por completo y vuelve a abrirlo** (para que reconozca Git).
5. Vuelve a este paso 2 (abrir la terminal) y sigue.

---

### Paso 1: Crear un repositorio en GitHub

1. Entra en **https://github.com** e inicia sesión.
2. Clic en **"+"** (arriba a la derecha) → **"New repository"**.
3. Rellena:
   - **Repository name:** por ejemplo `komvos-landing` (o el nombre que quieras).
   - **Description:** opcional, ej. "Landing Komvos".
   - **Public**.
   - **No** marques "Add a README", "Add .gitignore" ni "Choose a license" (el proyecto ya tiene esos archivos o no los necesitas para empezar).
4. Clic en **"Create repository"**.

### Paso 2: Abrir la terminal en la carpeta del proyecto

**Si estás en Cursor (haz exactamente esto):**  
1. Con este proyecto abierto en Cursor, mira la **barra de menú de arriba** (Archivo, Editar, Ver, Terminal, etc.).  
2. Clic en **Terminal**.  
3. En el desplegable, clic en **New Terminal** (o **Nueva terminal**).  
4. Abajo se abre un panel con una línea de texto (prompt). Al final de esa línea suele aparecer algo como `agencia-landing-prueba` o la ruta de tu proyecto.  
5. **Listo:** ya estás “en la carpeta del proyecto”. No escribas `cd` ni nada; pasa al Paso 3 y escribe ahí `git status`.

**Atajo de teclado:** En Cursor también puedes pulsar **Ctrl + ñ** (o **Ctrl + `** en teclados en inglés) para abrir/cerrar esa misma terminal.

**¿Qué es la terminal?**  
Es el panel donde escribes comandos (como `git add`, `git push`) en lugar de hacer clic. Cursor la abre ya en la carpeta de tu proyecto.

**Opción B – Desde el Explorador de Windows**  
1. Abre el **Explorador de archivos** y ve a la carpeta del proyecto:  
   `Escritorio → Hidekel → Cursor Paginas → agencia-landing-prueba`  
   (o donde tengas guardada la carpeta `agencia-landing-prueba`).  
2. Dentro de esa carpeta, haz **clic derecho** en un espacio vacío.  
3. Elige **“Abrir en Terminal”** o **“Open in Terminal”** (o “Abrir ventana de PowerShell aquí”).  
4. Se abre la terminal **ya dentro** de esa carpeta. Puedes pasar al Paso 3.

**Opción C – Abrir la terminal y entrar tú a la carpeta**  
1. Abre **PowerShell** o **CMD** (búscalo en el menú de Windows).  
2. Escribe este comando (cambia la ruta si tu carpeta está en otro sitio):

```bash
cd "E:\larah\OneDrive\Escritorio\Hidekel\Cursor Paginas\agencia-landing-prueba"
```

3. Pulsa **Enter**.  
4. Para comprobar que estás en la carpeta correcta, escribe `dir` y Enter: deberías ver carpetas como `app`, `components`, `public` y archivos como `package.json`.

**Resumen:** Si usas Cursor, con **Terminal → New Terminal** ya estás en la carpeta; si usas el Explorador, **clic derecho en la carpeta del proyecto → Abrir en Terminal**.

### Paso 3: Inicializar Git (si aún no está inicializado)

Comprueba si ya hay un repositorio Git:

```bash
git status
```

- Si dice algo como **"not a git repository"**, ejecuta:

```bash
git init
```

- Si ya muestra archivos o ramas, no hace falta `git init`.

### Paso 4: Añadir todos los archivos y hacer el primer commit

```bash
git add .
git commit -m "Primer commit: landing Komvos lista para Vercel"
```

### Paso 5: Conectar con GitHub y subir

En la página del repositorio que creaste en GitHub verás algo como "…or push an existing repository from the command line". Usa esas líneas, pero con tu usuario y nombre del repo. En general será:

```bash
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Sustituye:

- **TU-USUARIO** → tu usuario de GitHub.
- **TU-REPOSITORIO** → el nombre del repo (ej. `komvos-landing`).

Si GitHub te pide usuario y contraseña, usa un **Personal Access Token** como contraseña (no tu contraseña de la cuenta). Puedes crear uno en: GitHub → Settings → Developer settings → Personal access tokens.

Cuando `git push` termine, el código estará en GitHub.

---

## Parte 3: Vercel

### Paso 1: Entrar en Vercel

1. Entra en **https://vercel.com**.
2. Inicia sesión con **"Continue with GitHub"** (así Vercel podrá ver tus repositorios).

### Paso 2: Importar el proyecto

1. Clic en **"Add New..."** → **"Project"**.
2. En la lista de repositorios, elige **komvos-landing** (o el nombre que hayas usado).
3. Clic en **"Import"**.

### Paso 3: Configuración del proyecto y variable de entorno

Vercel detecta Next.js y suele dejar:

- **Framework Preset:** Next.js
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** (vacío)
- **Install Command:** `npm install`

**Importante:** Añade la variable de entorno para que el formulario "Agendar llamada" envíe los datos a tu Google Sheet:

1. En la misma pantalla de importación, abre **Environment Variables**.
2. **Name:** `GOOGLE_SHEETS_WEBAPP_URL`
3. **Value:** la URL de tu aplicación web de Google Apps Script (la que termina en `/exec`):  
   `https://script.google.com/macros/s/AKfycbyEm1moZNr9KBxLTQaoNTovkmu8QVFhVLprRbqNu_pg8e6ad79fWMwG6h17dmPLl8xt/exec`
4. Asegúrate de que esté aplicada a **Production** (y opcionalmente Preview).
5. Si ya desplegaste antes, después de añadirla ve a **Settings → Environment Variables** y haz **Redeploy** del último deployment para que la tome.

### Paso 4: Desplegar

1. Clic en **"Deploy"**.
2. Espera 1–2 minutos. Cuando termine, verás **"Congratulations"** y un enlace tipo `https://tu-proyecto.vercel.app`.

Esa URL es tu página en vivo. Cada vez que hagas `git push` a la rama `main`, Vercel volverá a desplegar solo.

---

## Resumen rápido

| Dónde   | Qué hacer |
|--------|-----------|
| GitHub | Crear repo → en tu PC: `git init` (si aplica), `git add .`, `git commit`, `git remote add origin ...`, `git push -u origin main` |
| Vercel | Login con GitHub → Add New → Project → elegir repo → Deploy |

Si en algún paso te pide algo que no aparece aquí (por ejemplo, dominio o variables de entorno), dime en qué paso estás y lo vemos.

---

## Si el host no carga (página en blanco o error)

1. **Revisa el deploy en Vercel**
   - Entra en **https://vercel.com** → tu proyecto **komvos-landing**.
   - Abre la pestaña **"Deployments"**.
   - Clic en el **último deployment** (el de arriba).
   - Mira el **estado**: si pone "Building" o "Error", abre los **logs** (Build Logs / Function Logs) y revisa si hay un mensaje de error en rojo.

2. **Si el build falla**
   - Copia el mensaje de error que salga en los logs y búscalo o compártelo para poder ajustar el proyecto.
   - Comprueba que en **Settings → General** no tengas **Output Directory** puesto (debe estar vacío para Next.js).

3. **Si el build termina bien pero la página no carga**
   - Abre la URL de Vercel en **modo incógnito** o en otro navegador.
   - Abre las **herramientas de desarrollador** (F12) → pestaña **Console** y mira si aparece algún error en rojo.
   - Prueba otra URL: a veces la raíz es `https://tu-proyecto.vercel.app/` (con barra al final).

4. **Forzar un nuevo deploy**
   - En el proyecto en Vercel: **Deployments** → los tres puntos del último deploy → **Redeploy**.

---

## Cambiar el nombre del proyecto en Vercel (ej. a "komvostudio")

Si tu proyecto en Vercel se llama **nextpulse-landing** y quieres cambiarlo a **komvostudio**:

1. Entra en **https://vercel.com** → abre tu proyecto.
2. Ve a **Settings** (Configuración).
3. En **Project Name** escribe el nuevo nombre: **komvostudio** (solo letras y números; sin guiones).
4. Si aparece la **advertencia naranja** sobre *OpenID Connect (OIDC)*:
   - Es normal. Solo afecta si usas OIDC con otro servicio (por ejemplo, CI/CD con tokens de Vercel).
   - Si **solo** usas Vercel para desplegar desde GitHub y ver la web, **puedes ignorar la advertencia** y guardar.
   - Si en el futuro usas OIDC con este proyecto, tendrás que actualizar la configuración de tu backend según la [documentación OIDC de Vercel](https://vercel.com/docs).
5. Guarda los cambios. La URL de tu sitio pasará a ser **https://komvostudio.vercel.app** (o la que tengas configurada).
