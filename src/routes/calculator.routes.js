import express from 'express';
import calculatorController from '../controllers/calculator.controller.js';

const router = express.Router();

/**
 * Rutas de la calculadora
 */

// Realizar operación
router.post('/operation', calculatorController.performOperation);

// Limpiar calculadora
router.post('/clear', calculatorController.clear);

// Deshacer operación
router.post('/undo', calculatorController.undo);

// Rehacer operación
router.post('/redo', calculatorController.redo);

// Obtener estado actual
router.get('/state', calculatorController.getState);

// Obtener historial
router.get('/history', calculatorController.getHistory);

export default router;
