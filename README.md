# Calculadora Backend con Patrón Memento

Backend en Express.js que implementa una calculadora con historial de estados usando el patrón de diseño Memento. La API ahora se centra en un único flujo: evaluar expresiones completas en una sola petición.

## Contexto del problema

- Objetivo: construir un backend de calculadora que evalúe expresiones en una sola petición y permita deshacer/rehacer estados con Memento, siguiendo buenas prácticas y documentación clara.
- Problema: las operaciones paso a paso complican el estado y la UX; se requiere historial confiable (undo/redo) sin exponer ni permitir modificar estados antiguos, y evitar `eval` por seguridad.
- Requisitos funcionales: evaluar `+ - * /` con decimales y paréntesis; mantener historial navegable; exponer endpoints `/evaluate`, `/undo`, `/redo`, `/clear`, `/state`, `/history`; mostrar la expresión original en el historial y en `lastOperation`.
- Requisitos no funcionales: parser seguro (Shunting Yard → RPN), logging HTTP (Morgan), recarga en desarrollo (Nodemon), diseño modular.
- Solución propuesta: patrón Memento con `Calculator` (Originator), `CalculatorMemento` (Memento) y `History` (Caretaker); util `expressionEvaluator.js`; controlador orquestando evaluación y guardado de mementos; rutas REST.
- Decisiones clave: unificar en `POST /evaluate`; `applyExpressionResult(result, expression)` guarda valor y expresión; en restore `lastOperation` usa la expresión sin prefijos; `History.push()` elimina “futuros” al escribir tras undo.
- Criterios de aceptación: evaluación correcta y persistencia en historial; `GET /history` refleja expresiones y estado actual; `undo/redo` restauran valor y expresión; manejo de errores (símbolo no soportado, división por cero, paréntesis, vacío).
- Próximos pasos (opcionales): operador potencia `^`, persistencia por usuario, autenticación/rate limiting, migración a TypeScript con interfaces.

## Patrón Memento

El patrón Memento permite capturar y restaurar el estado interno de un objeto sin violar su encapsulación. En este proyecto:

- Originator: `Calculator` (realiza operaciones y guarda su estado)
- Memento: `CalculatorMemento` (captura el estado + metadatos)
- Caretaker: `History` (gestiona undo/redo sobre los mementos)

## Características

- ✅ Evaluar una expresión completa en una sola petición (`/evaluate`)
- ✅ Operadores: `+`, `-`, `*`, `/`; paréntesis; decimales; espacios opcionales
- ✅ Historial con undo/redo y restauración de estado previa
- ✅ Parser seguro (sin `eval`): Shunting Yard → RPN → evaluación
- ✅ Logging HTTP con Morgan y recarga en desarrollo con Nodemon
- ✅ Arquitectura por capas y buenas prácticas
- ✅ Los mementos guardan valor y la expresión original usada (sin prefijo)

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Desarrollo (recarga automática con nodemon)
npm run dev

# Producción
npm start
```

## Endpoints

### POST /api/calculator/evaluate
Evalúa una expresión matemática completa y fija el resultado como nuevo estado actual.

Body:
```json
{
  "expression": "12*0.5+20*0.5"
}
```

Soporta:
- Operadores: `+` `-` `*` `/`
- Paréntesis: `(` `)`
- Decimales: `12.5`, `0.5`
- Espacios opcionales: `10 + 20 - 5`

Ejemplos válidos:
```
10+10           → 20
10-20+5         → -5
12*0.5+20*0.5   → 16
(2+3)*4-5/2     → 17.5
100/4+50*2      → 125
```

Errores posibles (400):
- Símbolo no soportado (p. ej., `^`)
- División por cero
- Paréntesis desbalanceados
- Expresión vacía

### POST /api/calculator/clear
Reinicia la calculadora a 0.

### POST /api/calculator/undo
Deshace la última evaluación (retrocede un memento).

### POST /api/calculator/redo
Rehace la evaluación deshecha (avanza un memento).

### GET /api/calculator/state
Estado actual de la calculadora (valor, última operación y metadatos de historial).

### GET /api/calculator/history
Historial completo con los estados guardados y el índice actual.

## Ejemplos rápidos

```text
1) Evaluar 10+10 → 20
2) Evaluar (5+3)*2-4 → 12
3) GET /state → { currentValue: 12, lastOperation: "(5+3)*2-4", ... }
4) POST /undo → vuelve a 20
5) POST /redo → vuelve a 12
6) Evaluar 12*0.5+20*0.5 → 16
```

## Formato de respuestas

### /api/calculator/evaluate
```json
{
  "success": true,
  "data": {
    "result": 16,
    "expression": "12*0.5+20*0.5",
    "operation": "12*0.5+20*0.5",
    "canUndo": true,
    "canRedo": false
  }
}
```

### /api/calculator/undo (ejemplo tras evaluar "5+5-2" y luego "3*3")
```json
{
  "success": true,
  "message": "Operación deshecha",
  "data": {
    "currentValue": 8,
    "lastOperation": "5+5-2",
    "canUndo": true,
    "canRedo": true
  }
}
```

### /api/calculator/history
```json
{
  "success": true,
  "data": {
    "history": [
      { "state": 0, "operation": "initial", "timestamp": "2025-11-08T16:51:24.180Z", "isCurrent": false },
      { "state": 8, "operation": "5+5-2", "timestamp": "2025-11-08T16:59:24.895Z", "isCurrent": false },
      { "state": 9, "operation": "3*3", "timestamp": "2025-11-08T17:01:11.000Z", "isCurrent": true }
    ],
    "info": { "totalStates": 3, "currentIndex": 2, "canUndo": true, "canRedo": false }
  }
}
```

### Notas sobre lastOperation
- En evaluaciones y restauraciones (undo/redo) `lastOperation` es siempre la expresión original sin agregar prefijos.
- Esto facilita comparar directamente lo ejecutado sin lógica adicional en el cliente.

## Seguridad del parser

- No se usa `eval`. Se implementa tokenización, conversión a RPN (Shunting Yard) y evaluación de pila.
- Validaciones: símbolos soportados, división por cero, paréntesis balanceados, expresión no vacía.
- Errores se devuelven con `400` y mensajes claros para el cliente.

## Estructura del proyecto

```
src/
├── config/
│   └── server.config.js            # Configuración del servidor
├── controllers/
│   └── calculator.controller.js    # Controlador HTTP
├── middlewares/
│   └── errorHandler.js             # Manejo de errores y 404
├── patterns/
│   └── memento/
│       ├── Calculator.js           # Originator
│       ├── CalculatorMemento.js    # Memento
│       └── History.js              # Caretaker
├── routes/
│   └── calculator.routes.js        # Rutas de la API
├── utils/
│   └── expressionEvaluator.js      # Tokenizer + Shunting Yard + RPN
└── index.js                        # Bootstrap del servidor

diagrams/
├── class-diagram.puml              # Diagrama de clases (Memento)
├── component-diagram.puml          # Diagrama de componentes
├── sequence-diagram.puml           # Diagrama de secuencia (evaluate/undo/redo)
└── README.md                       # Documentación de diagramas
```

## Diagramas UML

Se incluyen en `diagrams/` y pueden verse con la extensión PlantUML de VS Code o en el [editor online](http://www.plantuml.com/plantuml/uml/).

- Diagrama de Clases: estructura del patrón Memento y relaciones
- Diagrama de Componentes: arquitectura por capas del sistema
- Diagrama de Secuencia: flujo de evaluate con undo/redo

## Comandos útiles

PowerShell (Windows):

```powershell
# Estado inicial
Invoke-RestMethod -Uri http://localhost:3000/api/calculator/state

# Evaluar 10+10
$body = '{"expression":"10+10"}'
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/calculator/evaluate -ContentType 'application/json' -Body $body

# Evaluar expresión compleja
$body = '{"expression":"(5+3)*2-4"}'
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/calculator/evaluate -ContentType 'application/json' -Body $body

# Deshacer / Rehacer / Historial / Limpiar
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/calculator/undo
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/calculator/redo
Invoke-RestMethod -Uri http://localhost:3000/api/calculator/history
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/calculator/clear
```

cURL (Linux/Mac):

```bash
# Estado inicial
curl http://localhost:3000/api/calculator/state

# Evaluar 10+10
curl -X POST http://localhost:3000/api/calculator/evaluate -H "Content-Type: application/json" -d '{"expression":"10+10"}'

# Evaluar expresión compleja
curl -X POST http://localhost:3000/api/calculator/evaluate -H "Content-Type: application/json" -d '{"expression":"(5+3)*2-4"}'

# Deshacer / Rehacer / Historial / Limpiar
curl -X POST http://localhost:3000/api/calculator/undo
curl -X POST http://localhost:3000/api/calculator/redo
curl http://localhost:3000/api/calculator/history
curl -X POST http://localhost:3000/api/calculator/clear
```

## Notas

- Morgan está habilitado con formato `dev` por defecto para facilitar el debug durante el desarrollo.
- Nodemon recarga el servidor al cambiar archivos en `src/` (script `npm run dev`).
