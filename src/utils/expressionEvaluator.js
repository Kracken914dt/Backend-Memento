
const OPERATORS = {
  '+': { precedence: 1, assoc: 'L', fn: (a, b) => a + b },
  '-': { precedence: 1, assoc: 'L', fn: (a, b) => a - b },
  '*': { precedence: 2, assoc: 'L', fn: (a, b) => a * b },
  '/': { precedence: 2, assoc: 'L', fn: (a, b) => {
    if (b === 0) throw new Error('No se puede dividir por cero');
    return a / b;
  } }
};

function tokenize(expression) {
  const tokens = [];
  const cleaned = expression.replace(/\s+/g, '');
  let numberBuffer = '';
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (/\d|\./.test(ch)) {
      numberBuffer += ch;
      continue;
    }
    if (numberBuffer) {
      if (numberBuffer === '.' || numberBuffer === '-') {
        throw new Error('Número inválido en la expresión');
      }
      tokens.push(numberBuffer);
      numberBuffer = '';
    }
    if (OPERATORS[ch] || ch === '(' || ch === ')') {
      tokens.push(ch);
    } else {
      throw new Error(`Símbolo no soportado: '${ch}'`);
    }
  }
  if (numberBuffer) tokens.push(numberBuffer);
  return tokens;
}

function toRPN(tokens) {
  const output = [];
  const stack = [];
  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      output.push(token);
      continue;
    }
    if (OPERATORS[token]) {
      const o1 = OPERATORS[token];
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (OPERATORS[top]) {
          const o2 = OPERATORS[top];
          if ((o1.assoc === 'L' && o1.precedence <= o2.precedence) ||
              (o1.assoc === 'R' && o1.precedence < o2.precedence)) {
            output.push(stack.pop());
            continue;
          }
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
      let found = false;
      while (stack.length) {
        const t = stack.pop();
        if (t === '(') { found = true; break; }
        output.push(t);
      }
      if (!found) throw new Error('Paréntesis desbalanceados');
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

function evalRPN(rpn) {
  const stack = [];
  for (const token of rpn) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
      continue;
    }
    if (OPERATORS[token]) {
      if (stack.length < 2) throw new Error('Expresión inválida');
      const b = stack.pop();
      const a = stack.pop();
      const result = OPERATORS[token].fn(a, b);
      stack.push(result);
      continue;
    }
    throw new Error(`Token RPN inválido: ${token}`);
  }
  if (stack.length !== 1) throw new Error('Expresión inválida');
  return stack[0];
}

export function evaluateExpression(expression) {
  if (typeof expression !== 'string' || !expression.trim()) {
    throw new Error('La expresión debe ser un string no vacío');
  }
  const tokens = tokenize(expression);
  const rpn = toRPN(tokens);
  return evalRPN(rpn);
}

export default evaluateExpression;
