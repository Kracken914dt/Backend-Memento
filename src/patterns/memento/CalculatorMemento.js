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

 
  constructor(state, operation = 'initial') {
    this.#state = state;
    this.#timestamp = new Date();
    this.#operation = operation;
  }


  getState() {
    return this.#state;
  }

  
  getTimestamp() {
    return this.#timestamp;
  }


  getOperation() {
    return this.#operation;
  }

 
  getInfo() {
    return {
      state: this.#state,
      operation: this.#operation,
      timestamp: this.#timestamp.toISOString()
    };
  }
}

export default CalculatorMemento;
