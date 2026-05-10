# Escáner de Productos - Supermercados Verito Cedeño

Aplicación web para escanear códigos de barras de productos usando una cámara web y Supabase como base de datos.

## Características

- 📱 Escáner de códigos de barras en tiempo real
- 🔍 Búsqueda por nombre o código
- 📊 Integración con Supabase
- ⚡ Optimizado para dispositivos móviles
- 🌐 Funciona en Vercel

## Instalación

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta y nuevo proyecto
3. Obtén tu `SUPABASE_URL` y `SUPABASE_ANON_KEY` en Configuración → API

### 2. Crear tabla de productos

En el SQL Editor de Supabase, ejecuta:

```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  barcode TEXT UNIQUE NOT NULL,
  codigo TEXT,
  nombre TEXT NOT NULL,
  name TEXT,
  precio DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_barcode ON products(barcode);
CREATE INDEX idx_codigo ON products(codigo);
CREATE INDEX idx_nombre ON products(nombre);
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Llena con tus credenciales de Supabase:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Ejecutar localmente

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Deploy en Vercel

### 1. Push a GitHub

```bash
git add .
git commit -m "Setup Supabase integration"
git push
```

### 2. Importar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "New Project"
3. Selecciona tu repositorio `zambrano30/Scaner`
4. En "Environment Variables", agrega:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click en "Deploy"

## Estructura del Proyecto

```
scaner/
├── public/
│   └── index.html          # Frontend con escáner
├── api/
│   └── index.js            # Backend con Express
├── package.json
├── vercel.json
├── .env.example
└── README.md
```

## API Endpoints

- `GET /api/config` - Obtener configuración de Supabase
- `GET /api/product/:code` - Buscar producto por código
- `GET /api/products` - Obtener todos los productos
- `GET /api/search?q=query` - Buscar productos
- `GET /api/health` - Health check

## Importar datos

Para importar datos desde CSV a Supabase:

1. Prepara un CSV con columnas: `barcode`, `codigo`, `nombre`, `precio`, `stock`
2. En Supabase → SQL Editor, usa:

```sql
COPY products(barcode, codigo, nombre, precio, stock) 
FROM STDIN WITH (FORMAT csv);
```

O usa la interfaz de Supabase para importar directamente.

## Troubleshooting

### Error: "Producto no encontrado"
- Verifica que los códigos de barras estén correctamente ingresados en Supabase
- Asegúrate que la columna `barcode` tenga el formato correcto

### Cámara no funciona
- Usa HTTPS (Vercel lo proporciona automáticamente)
- En desarrollo local, usa `http://localhost:3000`
- Los navegadores requieren HTTPS para acceder a la cámara

### Error de Supabase
- Verifica que las variables de entorno estén configuradas
- Revisa que la tabla `products` existe y tiene datos
- Comprueba los RLS (Row Level Security) de la tabla

## Licencia

MIT
