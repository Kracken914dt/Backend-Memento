import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/server.config.js';
import morgan from 'morgan';
import calculatorRoutes from './routes/calculator.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';


const app = express();


app.use(cors(serverConfig.corsOptions));
app.use(morgan(process.env.MORGAN_FORMAT || 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API de Calculadora con Patrón Memento',
    version: '1.0.0',
    endpoints: {
      operation: 'POST /api/calculator/operation',
      clear: 'POST /api/calculator/clear',
      undo: 'POST /api/calculator/undo',
      redo: 'POST /api/calculator/redo',
      state: 'GET /api/calculator/state',
      history: 'GET /api/calculator/history'
    }
  });
});


app.use('/api/calculator', calculatorRoutes);


app.use(notFoundHandler);
app.use(errorHandler);


const startServer = () => {
  try {
    app.listen(serverConfig.port, () => {
      console.log('╔════════════════════════════════════════════════════╗');
      console.log('║   🚀 Servidor Express iniciado correctamente      ║');
      console.log('╠════════════════════════════════════════════════════╣');
      console.log(`║   📡 Puerto: ${serverConfig.port}                               ║`);
      console.log(`║   🌐 URL: http://localhost:${serverConfig.port}               ║`);
      console.log('║   📦 Patrón: Memento                               ║');
      console.log('╚════════════════════════════════════════════════════╝');
      console.log('\n✅ El servidor está listo para recibir peticiones\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
