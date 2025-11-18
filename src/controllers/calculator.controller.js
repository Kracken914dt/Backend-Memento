import Calculator from '../patterns/memento/Calculator.js';
import History from '../patterns/memento/History.js';

class CalculatorController {
  #calculator;
  #history;

  constructor() {
    this.#calculator = new Calculator();
    this.#history = new History();
    
    // Guardar el estado inicial
    this.#history.push(this.#calculator.save());
  }

 
  evaluateExpression = (req, res, next) => {
    try {
      const { expression } = req.body || {};

      if (!expression || typeof expression !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'El campo "expression" es requerido y debe ser un string'
        });
      }

      const result = this.#calculator.evaluate(expression);
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


export default new CalculatorController();
