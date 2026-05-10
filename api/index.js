import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️  Faltan variables de entorno: SUPABASE_URL y SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Ruta para obtener configuración de Supabase (para el frontend)
app.get('/api/config', (req, res) => {
  res.json({
    url: supabaseUrl,
    key: supabaseKey
  });
});

// Ruta para buscar producto por código
app.get('/api/product/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`barcode.eq.${code},codigo.eq.${code}`)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1000);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para buscar productos
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Parámetro "q" requerido' });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`nombre.ilike.%${q}%,codigo.ilike.%${q}%,barcode.ilike.%${q}%`)
      .limit(20);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📊 Supabase URL: ${supabaseUrl ? '✓ Configurado' : '✗ No configurado'}`);
});

export default app;
