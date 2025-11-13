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

  //Guarda un nuevo memento en el historial
  
  push(memento) {
    // Si estamos en medio del historial, eliminamos los estados futuros
    if (this.#currentIndex < this.#mementos.length - 1) {
      this.#mementos = this.#mementos.slice(0, this.#currentIndex + 1);
    }

    this.#mementos.push(memento);
    this.#currentIndex++;
  }


  undo() {
    if (!this.canUndo()) {
      return null;
    }

    this.#currentIndex--;
    return this.#mementos[this.#currentIndex];
  }


  redo() {
    if (!this.canRedo()) {
      return null;
    }

    this.#currentIndex++;
    return this.#mementos[this.#currentIndex];
  }

  canUndo() {
    return this.#currentIndex > 0;
  }

  
  canRedo() {
    return this.#currentIndex < this.#mementos.length - 1;
  }

//memento actual
  getCurrentMemento() {
    if (this.#currentIndex >= 0 && this.#currentIndex < this.#mementos.length) {
      return this.#mementos[this.#currentIndex];
    }
    return null;
  }

  getHistory() {
    return this.#mementos.map((memento, index) => ({
      ...memento.getInfo(),
      isCurrent: index === this.#currentIndex
    }));
  }

  clear() {
    this.#mementos = [];
    this.#currentIndex = -1;
  }


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
