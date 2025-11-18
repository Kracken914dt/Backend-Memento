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


  #operators = {
    '+': { p: 1, fn: (a, b) => a + b },
    '-': { p: 1, fn: (a, b) => a - b },
    '*': { p: 2, fn: (a, b) => a * b },
    '/': { p: 2, fn: (a, b) => {
      if (b === 0) throw new Error('No se puede dividir por cero');
      return a / b;
    }}
  };

  constructor() {
    this.#currentValue = 0;
    this.#lastOperation = 'initial';
  }

 
  evaluate(expression) {
    if (typeof expression !== 'string' || !expression.trim()) {
      throw new Error('La expresión debe ser un string no vacío');
    }

    const tokens = this.#tokenize(expression);
    const rpn = this.#toRPN(tokens);
    const result = this.#evalRPN(rpn);

    this.#currentValue = result;
    this.#lastOperation = expression.trim();

    return result;
  }

  clear() {
    this.#currentValue = 0;
    this.#lastOperation = 'clear';
  }

  getCurrentValue() {
    return this.#currentValue;
  }

  getLastOperation() {
    return this.#lastOperation;
  }

  // === Métodos privados para evaluación de expresiones ===

  #tokenize(expression) {
    const cleaned = expression.replace(/\s+/g, '');
    const tokens = [];
    let num = '';

    for (let i = 0; i < cleaned.length; i++) {
      const ch = cleaned[i];

      if ((ch >= '0' && ch <= '9') || ch === '.') {
        num += ch;
        continue;
      }

      if (num) {
        if (num === '.') throw new Error('Número inválido en la expresión');
        tokens.push(num);
        num = '';
      }

      if (this.#operators[ch] || ch === '(' || ch === ')') {
        tokens.push(ch);
        continue;
      }

      throw new Error(`Símbolo no soportado: '${ch}'`);
    }

    if (num) tokens.push(num);
    return tokens;
  }

  #toRPN(tokens) {
    const output = [];
    const stack = [];

    for (const token of tokens) {
      if (!isNaN(Number(token))) {
        output.push(token);
        continue;
      }

      if (this.#operators[token]) {
        const p1 = this.#operators[token].p;
        while (stack.length) {
          const top = stack[stack.length - 1];
          if (this.#operators[top] && this.#operators[top].p >= p1) {
            output.push(stack.pop());
            continue;
          }
          break;
        }
        stack.push(token);
        continue;
      }

      if (token === '(') { 
        stack.push(token); 
        continue; 
      }
      
      if (token === ')') {
        let matched = false;
        while (stack.length) {
          const t = stack.pop();
          if (t === '(') { 
            matched = true; 
            break; 
          }
          output.push(t);
        }
        if (!matched) throw new Error('Paréntesis desbalanceados');
        continue;
      }

      throw new Error(`Token inesperado: ${token}`);
    }

    while (stack.length) {
      const t = stack.pop();
      if (t === '(' || t === ')') throw new Error('Paréntesis desbalanceados');
      output.push(t);
    }

    return output;
  }

  #evalRPN(rpn) {
    const stack = [];
    for (const token of rpn) {
      if (!isNaN(Number(token))) {
        stack.push(Number(token));
        continue;
      }
      if (this.#operators[token]) {
        if (stack.length < 2) throw new Error('Expresión inválida');
        const b = stack.pop();
        const a = stack.pop();
        const result = this.#operators[token].fn(a, b);
        stack.push(result);
        continue;
      }
      throw new Error(`Token RPN inválido: ${token}`);
    }
    if (stack.length !== 1) throw new Error('Expresión inválida');
    return stack[0];
  }

  // === Métodos del patrón Memento ===

 
  save() {
    return new CalculatorMemento(this.#currentValue, this.#lastOperation);
  }


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
