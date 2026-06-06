# 🗒️ Hoja de Ruta y Tareas Pendientes (QSTG.cl)

Este archivo sirve para coordinar el desarrollo entre el Front-End y el sistema de scraping (JP). Aquí hacemos seguimiento a lo que ya está listo, lo que está en proceso y las ideas futuras.

---

## 🟩 Completado (Listo para Producción)

- [x] **Migración a Base de Datos:** Eliminación de categorías cableadas (`hardcoded`) en el Front.
- [x] **Conector de Supabase:** Cliente configurado e integrado de forma segura a través de variables de entorno (`.env.local`).
- [x] **Rutas Dinámicas Especializadas:** El App Router (`app/[categoria]/page.tsx`) ahora resuelve los slugs consultando directamente a la BD.
- [x] **Gestor de Banners Publicitarios (Sponsors):** Automatización del `MainBanner` mediante la columna `slug_sponsor` en Supabase.
- [x] **Inauguración de Categoría:** Creación e inserción exitosa de la categoría `FESTIVALES` (`🎪`) en la base de datos.
- [x] **Blindaje de Seguridad:** Archivo `.gitignore` configurado para evitar filtración de llaves API.

---

## 🟨 En Proceso / Pendiente (Próximos Pasos)

### 🤖 Lado de Juan Pablo (Scraper e Ingesta)

- [ ] **Clasificación de Eventos:** Configurar el robot para que asigne la etiqueta exacta `"FESTIVALES"` en el campo `"Categoría"` del JSON a los eventos masivos correspondientes.
- [ ] **Normalización de Texto:** Asegurar que las categorías del JSON vengan siempre en mayúsculas estrictas para hacer match limpio con `nombre_json` de la BD.

### 💻 Lado de Gonza (Front-End / UI)

- [ ] **Optimización del Estado de Carga:** Agregar un esqueleto de carga (_Skeleton Loader_) visual en lo que el `useEffect` descarga las categorías de Supabase, para evitar que los botones "parpadeen" al cargar la página.
- [ ] **Control de Errores (Fallback):** Asegurar que si la base de datos de Supabase se cae o excede el límite de cuota, el Front muestre una lista de categorías de respaldo por defecto en lugar de quedar en blanco.

---

## 🟦 Ideas Futuras / Backlog (Para más adelante)

- [ ] **Migración total del JSON a BD:** Mover el archivo estático `eventos.json` completo a una tabla de Supabase para que los eventos también se consulten mediante API en tiempo real.
- [ ] **Panel de Administración Interno:** Crear una vista protegida (`/admin`) para poder agregar nuevas categorías o cambiar los banners de los sponsors con un formulario visual, sin tener que entrar a la consola de Supabase.
