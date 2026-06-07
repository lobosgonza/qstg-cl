# 🚀 QSTG.cl - Front-End Dinámico & Automatizado

Este es el repositorio del Front-End para **QSTG.cl** desarrollado en Next.js utilizando el App Router. Se ha migrado la arquitectura estática original a un sistema 100% dinámico conectado a **Supabase**, permitiendo que las categorías de la barra de navegación y los banners comerciales (Sponsors) se gestionen directamente desde la base de datos sin necesidad de modificar el código ni realizar nuevos despliegues.

---

## 🛠️ Novedades de la Arquitectura (Lo que se hizo)

1. **Cliente Global de Supabase:** Se configuró el conector nativo en la raíz (`supabaseClient.ts`) sincronizado mediante variables de entorno seguras.
2. **Categorías 100% Vivas:** Se eliminó el arreglo estático `CATEGORIAS_HOME` de `app/page.tsx`. Ahora el componente realiza un `useEffect` que consulta la tabla `categorias_maestras` en tiempo real. Si agregas una categoría en Supabase, aparece en la web instantáneamente.
3. **Barra de URLs Dinámica e Indexable (SEO):** Se reestructuró `app/[categoria]/page.tsx`. Cuando un usuario ingresa directamente a una ruta (ej: `/electronica` o `/festivales`), el servidor consulta el slug a la base de datos, obtiene el string formateado y renderiza el catálogo de inmediato de forma limpia.
4. **Sponsors por Categoría Automatizados:** El componente `MainBanner` ahora inyecta el show patrocinado basado en la columna `slug_sponsor` de la tabla de categorías en Supabase, permitiendo vender banners de manera independiente por sección.

---

## 🗄️ Estructura de la Tabla en Supabase

Para que el proyecto funcione, la base de datos cuenta con la siguiente tabla en el esquema público:

```sql
create table categorias_maestras (
  id bigint generated always as identity primary key,
  nombre_json text unique not null,   -- Ejemplo: 'FESTIVALES' (Match exacto con el scraper)
  slug_url text unique not null,      -- Ejemplo: 'festivales' (Para la ruta /festivales)
  icono text not null,                -- Ejemplo: '🎪' (Emoji del botón)
  slug_sponsor text default null,     -- Ejemplo: 'lollapalooza-chile-2027' (Amarre comercial)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Habilitado para lectura pública:
alter table categorias_maestras enable row level security;
create policy "Permitir lectura pública de categorías" on categorias_maestras for select using (true);
```
