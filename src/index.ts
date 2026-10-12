import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './interface/routes/auth.routes';
import productoRoutes from './interface/routes/producto.routes';
import pedidoRoutes from './interface/routes/pedido.routes';
import { errorHandler } from './interface/middlewares/error.middleware';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === FRONTEND_URL || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`⚡ Servidor corriendo en http://localhost:${PORT}`);
});