/**
 * Configuración del servidor
 */
export const serverConfig = {
  port: process.env.PORT || 3000,
  corsOptions: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};
