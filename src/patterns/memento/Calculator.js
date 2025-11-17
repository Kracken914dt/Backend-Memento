import CalculatorMemento from './CalculatorMemento.js';

/**
 * Originator - Calculadora que crea y restaura mementos
 * 
 * Esta clase es responsable de realizar operaciones matemáticas
 * y de crear snapshots de su estado mediante mementos.
 */
class Calculator {
  #currentValue;
  #lastOperation;

  constructor() {
    this.#currentValue = 0;
    this.#lastOperation = 'initial';
  }

 
  add(value) {
    this.#validateNumber(value);
    this.#currentValue += value;
    this.#lastOperation = `sumar ${value}`;
    return this.#currentValue;
  }

  
  subtract(value) {
    this.#validateNumber(value);
    this.#currentValue -= value;
    this.#lastOperation = `restar ${value}`;
    return this.#currentValue;
  }

  
  multiply(value) {
    this.#validateNumber(value);
    this.#currentValue *= value;
    this.#lastOperation = `multiplicar ${value}`;
    return this.#currentValue;
  }


  divide(value) {
    this.#validateNumber(value);
    if (value === 0) {
      throw new Error('No se puede dividir por cero');
    }
    this.#currentValue /= value;
    this.#lastOperation = `dividir ${value}`;
    return this.#currentValue;
  }

  clear() {
    this.#currentValue = 0;
    this.#lastOperation = 'clear';
  }

 
  #validateNumber(value) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('El valor debe ser un número válido');
    }
  }


  getCurrentValue() {
    return this.#currentValue;
  }

 
  getLastOperation() {
    return this.#lastOperation;
  }

 
  applyExpressionResult(result, expression) {
    this.#validateNumber(result);
    this.#currentValue = result;
    // Guardamos la expresión original (trim para limpiar espacios extremos)
    this.#lastOperation = (typeof expression === 'string') ? expression.trim() : String(expression);
    return this.#currentValue;
  }

  //Crea un memento con el estado actual (patrón Memento)
  save() {
    return new CalculatorMemento(this.#currentValue, this.#lastOperation);
  }

  //Restaura el estado desde un memento (patrón Memento)
  
   
  restore(memento) {
    if (!(memento instanceof CalculatorMemento)) {
      throw new Error('El argumento debe ser una instancia de CalculatorMemento');
    }
    this.#currentValue = memento.getState();
    this.#lastOperation = memento.getOperation();
  }


  getState() {
    return {
      currentValue: this.#currentValue,
      lastOperation: this.#lastOperation
    };
  }
}

export default Calculator;
