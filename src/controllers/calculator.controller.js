import Calculator from '../patterns/memento/Calculator.js';
import History from '../patterns/memento/History.js';

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
   * Realiza una operación matemática
   */
  performOperation = (req, res, next) => {
    try {
      const { operation, value } = req.body;

      // Validaciones
      if (!operation) {
        return res.status(400).json({
          success: false,
          message: 'La operación es requerida'
        });
      }

      if (value === undefined || value === null) {
        return res.status(400).json({
          success: false,
          message: 'El valor es requerido'
        });
      }

      const numericValue = Number(value);
      if (isNaN(numericValue)) {
        return res.status(400).json({
          success: false,
          message: 'El valor debe ser un número válido'
        });
      }

      // Realizar la operación (acepta nombres en español y alias comunes)
      let result;
      switch (operation.toLowerCase()) {
        case 'sumar':
          result = this.#calculator.add(numericValue);
          break;
        case 'restar':
          result = this.#calculator.subtract(numericValue);
          break;
        case 'multiplicar':
          result = this.#calculator.multiply(numericValue);
          break;
        case 'dividir':
          result = this.#calculator.divide(numericValue);
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Operación no válida. Use: sumar, restar, multiplicar, dividir'
          });
      }

      // Guardar el estado después de la operación
      this.#history.push(this.#calculator.save());

      res.json({
        success: true,
        data: {
          result,
          operation: this.#calculator.getLastOperation(),
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
