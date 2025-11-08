import Calculator from '../patterns/memento/Calculator.js';
import History from '../patterns/memento/History.js';
import { evaluateExpression } from '../utils/expressionEvaluator.js';

/**
 * Controlador de la calculadora
 * Gestiona las operaciones y el historial mediante el patrón Memento
 */
class CalculatorController {
  #calculator;
  #history;

  constructor() {
    this.#calculator = new Calculator();
    this.#history = new History();
    
    // Guardar el estado inicial
    this.#history.push(this.#calculator.save());
  }

  /**
   * Evalúa una expresión matemática completa en una sola petición
   * Body esperado: { expression: "10+20*5" }
   * Soporta: + - * / y paréntesis. Respeta precedencia de operadores.
   * Utiliza el patrón Memento para guardar el estado y permitir undo/redo.
   */
  evaluateExpression = (req, res, next) => {
    try {
      const { expression } = req.body || {};

      if (!expression || typeof expression !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'El campo "expression" es requerido y debe ser un string'
        });
      }

  const result = evaluateExpression(expression);

  // Fijamos directamente el resultado y guardamos la EXPRESIÓN como operación
  this.#calculator.applyExpressionResult(result, expression);
  this.#history.push(this.#calculator.save());

      return res.json({
        success: true,
        data: {
          result,
          expression,
          operation: expression,
          canUndo: this.#history.canUndo(),
          canRedo: this.#history.canRedo()
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Limpia la calculadora
   */
  clear = (req, res, next) => {
    try {
      this.#calculator.clear();
      this.#history.push(this.#calculator.save());

      res.json({
        success: true,
        message: 'Calculadora reiniciada',
        data: this.#calculator.getState()
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deshace la última operación
   */
  undo = (req, res, next) => {
    try {
      if (!this.#history.canUndo()) {
        return res.status(400).json({
          success: false,
          message: 'No hay operaciones para deshacer'
        });
      }

      const memento = this.#history.undo();
      this.#calculator.restore(memento);

      res.json({
        success: true,
        message: 'Operación deshecha',
        data: {
          ...this.#calculator.getState(),
          canUndo: this.#history.canUndo(),
          canRedo: this.#history.canRedo()
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Rehace la última operación deshecha
   */
  redo = (req, res, next) => {
    try {
      if (!this.#history.canRedo()) {
        return res.status(400).json({
          success: false,
          message: 'No hay operaciones para rehacer'
        });
      }

      const memento = this.#history.redo();
      this.#calculator.restore(memento);

      res.json({
        success: true,
        message: 'Operación rehecha',
        data: {
          ...this.#calculator.getState(),
          canUndo: this.#history.canUndo(),
          canRedo: this.#history.canRedo()
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene el estado actual
   */
  getState = (req, res, next) => {
    try {
      res.json({
        success: true,
        data: {
          ...this.#calculator.getState(),
          historyInfo: this.#history.getInfo()
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene el historial completo
   */
  getHistory = (req, res, next) => {
    try {
      res.json({
        success: true,
        data: {
          history: this.#history.getHistory(),
          info: this.#history.getInfo()
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

// Exportar una única instancia (Singleton)
export default new CalculatorController();
