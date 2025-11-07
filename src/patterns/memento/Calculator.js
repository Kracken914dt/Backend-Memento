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

  /**
   * Suma un valor al estado actual
   * @param {number} value
   * @returns {number}
   */
  add(value) {
    this.#validateNumber(value);
    this.#currentValue += value;
    this.#lastOperation = `sumar ${value}`;
    return this.#currentValue;
  }

  /**
   * Resta un valor del estado actual
   * @param {number} value
   * @returns {number}
   */
  subtract(value) {
    this.#validateNumber(value);
    this.#currentValue -= value;
    this.#lastOperation = `restar ${value}`;
    return this.#currentValue;
  }

  /**
   * Multiplica el estado actual por un valor
   * @param {number} value
   * @returns {number}
   */
  multiply(value) {
    this.#validateNumber(value);
    this.#currentValue *= value;
    this.#lastOperation = `multiplicar ${value}`;
    return this.#currentValue;
  }

  /**
   * Divide el estado actual por un valor
   * @param {number} value
   * @returns {number}
   * @throws {Error} Si se intenta dividir por cero
   */
  divide(value) {
    this.#validateNumber(value);
    if (value === 0) {
      throw new Error('No se puede dividir por cero');
    }
    this.#currentValue /= value;
    this.#lastOperation = `dividir ${value}`;
    return this.#currentValue;
  }

  /**
   * Reinicia el valor de la calculadora
   */
  clear() {
    this.#currentValue = 0;
    this.#lastOperation = 'clear';
  }

  /**
   * Valida que el valor sea un número
   * @private
   * @param {*} value
   * @throws {Error} Si el valor no es un número
   */
  #validateNumber(value) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('El valor debe ser un número válido');
    }
  }

  /**
   * Obtiene el valor actual
   * @returns {number}
   */
  getCurrentValue() {
    return this.#currentValue;
  }

  /**
   * Obtiene la última operación realizada
   * @returns {string}
   */
  getLastOperation() {
    return this.#lastOperation;
  }

  /**
   * Crea un memento con el estado actual (patrón Memento)
   * @returns {CalculatorMemento}
   */
  save() {
    return new CalculatorMemento(this.#currentValue, this.#lastOperation);
  }

  /**
   * Restaura el estado desde un memento (patrón Memento)
   * @param {CalculatorMemento} memento
   */
  restore(memento) {
    if (!(memento instanceof CalculatorMemento)) {
      throw new Error('El argumento debe ser una instancia de CalculatorMemento');
    }
    this.#currentValue = memento.getState();
    this.#lastOperation = `restaurado: ${memento.getOperation()}`;
  }

  /**
   * Obtiene el estado actual de la calculadora
   * @returns {Object}
   */
  getState() {
    return {
      currentValue: this.#currentValue,
      lastOperation: this.#lastOperation
    };
  }
}

export default Calculator;
