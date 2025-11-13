import express from 'express';
import calculatorController from '../controllers/calculator.controller.js';

const router = express.Router();



router.post('/evaluate', calculatorController.evaluateExpression);


router.post('/clear', calculatorController.clear);


router.post('/undo', calculatorController.undo);


router.post('/redo', calculatorController.redo);


router.get('/state', calculatorController.getState);


router.get('/history', calculatorController.getHistory);

export default router;
