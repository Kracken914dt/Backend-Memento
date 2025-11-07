/**
 * Caretaker - Gestor del historial de estados
 * 
 * Esta clase es responsable de mantener el historial de mementos
 * y proporcionar funcionalidad de undo/redo.
 */
class History {
  #mementos;
  #currentIndex;

  constructor() {
    this.#mementos = [];
    this.#currentIndex = -1;
  }

  /**
   * Guarda un nuevo memento en el historial
   * @param {CalculatorMemento} memento
   */
  push(memento) {
    // Si estamos en medio del historial, eliminamos los estados futuros
    if (this.#currentIndex < this.#mementos.length - 1) {
      this.#mementos = this.#mementos.slice(0, this.#currentIndex + 1);
    }

    this.#mementos.push(memento);
    this.#currentIndex++;
  }

  /**
   * Retrocede al estado anterior (undo)
   * @returns {CalculatorMemento|null}
   */
  undo() {
    if (!this.canUndo()) {
      return null;
    }

    this.#currentIndex--;
    return this.#mementos[this.#currentIndex];
  }

  /**
   * Avanza al siguiente estado (redo)
   * @returns {CalculatorMemento|null}
   */
  redo() {
    if (!this.canRedo()) {
      return null;
    }

    this.#currentIndex++;
    return this.#mementos[this.#currentIndex];
  }

  /**
   * Verifica si se puede deshacer
   * @returns {boolean}
   */
  canUndo() {
    return this.#currentIndex > 0;
  }

  /**
   * Verifica si se puede rehacer
   * @returns {boolean}
   */
  canRedo() {
    return this.#currentIndex < this.#mementos.length - 1;
  }

  /**
   * Obtiene el memento actual
   * @returns {CalculatorMemento|null}
   */
  getCurrentMemento() {
    if (this.#currentIndex >= 0 && this.#currentIndex < this.#mementos.length) {
      return this.#mementos[this.#currentIndex];
    }
    return null;
  }

  /**
   * Obtiene todo el historial
   * @returns {Array}
   */
  getHistory() {
    return this.#mementos.map((memento, index) => ({
      ...memento.getInfo(),
      isCurrent: index === this.#currentIndex
    }));
  }

  /**
   * Limpia todo el historial
   */
  clear() {
    this.#mementos = [];
    this.#currentIndex = -1;
  }

  /**
   * Obtiene información del estado del historial
   * @returns {Object}
   */
  getInfo() {
    return {
      totalStates: this.#mementos.length,
      currentIndex: this.#currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }
}

export default History;
