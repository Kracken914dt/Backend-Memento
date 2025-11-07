/**
 * Memento - Almacena el estado inmutable de la calculadora
 * 
 * Este objeto captura y almacena el estado interno de la calculadora
 * sin exponer los detalles de implementación.
 */
class CalculatorMemento {
  #state;
  #timestamp;
  #operation;

  /**
   * @param {number} state - El valor actual de la calculadora
   * @param {string} operation - La operación que se realizó
   */
  constructor(state, operation = 'initial') {
    this.#state = state;
    this.#timestamp = new Date();
    this.#operation = operation;
  }

  /**
   * Obtiene el estado almacenado
   * @returns {number}
   */
  getState() {
    return this.#state;
  }

  /**
   * Obtiene la marca de tiempo
   * @returns {Date}
   */
  getTimestamp() {
    return this.#timestamp;
  }

  /**
   * Obtiene la operación realizada
   * @returns {string}
   */
  getOperation() {
    return this.#operation;
  }

  /**
   * Obtiene información completa del memento
   * @returns {Object}
   */
  getInfo() {
    return {
      state: this.#state,
      operation: this.#operation,
      timestamp: this.#timestamp.toISOString()
    };
  }
}

export default CalculatorMemento;
