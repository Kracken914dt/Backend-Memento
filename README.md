# Calculadora Backend con Patrón Memento

Backend desarrollado en Express.js que implementa una calculadora básica utilizando el patrón de diseño Memento.

## Patrón Memento

El patrón Memento permite capturar y restaurar el estado interno de un objeto sin violar su encapsulación. En este proyecto:

- **Originator (Calculator)**: La calculadora que realiza operaciones y guarda su estado
- **Memento (CalculatorMemento)**: Almacena el estado de la calculadora
- **Caretaker (History)**: Gestiona el historial de estados guardados

## Características

- ✅ Operaciones básicas: suma, resta, multiplicación, división
- ✅ Historial de operaciones (undo/redo)
- ✅ Restaurar estado previo
- ✅ API RESTful
- ✅ Buenas prácticas de programación
- ✅ Separación de responsabilidades

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Modo desarrollo (con watch mode)
npm run dev

# Modo producción
npm start
```

## Endpoints

### POST /api/calculator/operation
Realiza una operación matemática

**Body:**
```json
{
  "operation": "sumar|restar|multiplicar|dividir",
  "value": 10
}
```

### POST /api/calculator/clear
Reinicia la calculadora

### POST /api/calculator/undo
Deshace la última operación

### POST /api/calculator/redo
Rehace la operación deshecha

### GET /api/calculator/state
Obtiene el estado actual de la calculadora

### GET /api/calculator/history
Obtiene el historial completo de operaciones

## Ejemplo de uso

```javascript
// 1. Sumar 10
POST /api/calculator/operation
{ "operation": "sumar", "value": 10 }
// Resultado: 10

// 2. Multiplicar por 5
POST /api/calculator/operation
{ "operation": "multiplicar", "value": 5 }
// Resultado: 50

// 3. Deshacer (volver a 10)
POST /api/calculator/undo
// Resultado: 10

// 4. Rehacer (volver a 50)
POST /api/calculator/redo
// Resultado: 50
```

## Estructura del Proyecto

```
src/
├── config/
│   └── server.config.js       # Configuración del servidor
├── patterns/
│   └── memento/
│       ├── Calculator.js       # Originator
│       ├── CalculatorMemento.js # Memento
│       └── History.js          # Caretaker
├── controllers/
│   └── calculator.controller.js
├── routes/
│   └── calculator.routes.js
├── middlewares/
│   └── errorHandler.js
└── index.js                    # Punto de entrada
diagrams/
├── class-diagram.puml          # Diagrama de clases
├── component-diagram.puml      # Diagrama de componentes
├── sequence-diagram.puml       # Diagrama de secuencia
└── README.md                   # Documentación de diagramas
```

## Diagramas UML

El proyecto incluye diagramas UML en formato PlantUML en la carpeta `diagrams/`:

- **Diagrama de Clases:** Estructura del patrón Memento y relaciones
- **Diagrama de Componentes:** Arquitectura por capas del sistema
- **Diagrama de Secuencia:** Flujo de operaciones con undo/redo

Para visualizarlos, instala la extensión **PlantUML** en VS Code o usa el [editor online](http://www.plantuml.com/plantuml/uml/).


# Ejemplos de uso de la API

## Configuración
BASE_URL=http://localhost:3000/api/calculator

---

## 1. Verificar estado inicial
GET http://localhost:3000/api/calculator/state

### Respuesta esperada:
```json
{
  "success": true,
  "data": {
    "currentValue": 0,
    "lastOperation": "initial",
    "historyInfo": {
      "totalStates": 1,
      "currentIndex": 0,
      "canUndo": false,
      "canRedo": false
    }
  }
}
```

---

## 2. Sumar 10
POST http://localhost:3000/api/calculator/operation
Content-Type: application/json

{
  "operation": "sumar",
  "value": 10
}

### Respuesta esperada:
```json
{
  "success": true,
  "data": {
    "result": 10,
  "operation": "sumar 10",
    "canUndo": true,
    "canRedo": false
  }
}
```

---

## 3. Multiplicar por 5
POST http://localhost:3000/api/calculator/operation
Content-Type: application/json

{
  "operation": "multiplicar",
  "value": 5
}

### Respuesta esperada:
```json
{
  "success": true,
  "data": {
    "result": 50,
  "operation": "multiplicar 5",
    "canUndo": true,
    "canRedo": false
  }
}
```

---

## 4. Restar 20
POST http://localhost:3000/api/calculator/operation
Content-Type: application/json

{
  "operation": "restar",
  "value": 20
}

### Respuesta esperada:
```json
{
  "success": true,
  "data": {
    "result": 30,
  "operation": "restar 20",
    "canUndo": true,
    "canRedo": false
  }
}
```

---

## 5. Dividir por 3
POST http://localhost:3000/api/calculator/operation
Content-Type: application/json

{
  "operation": "dividir",
  "value": 3
}

### Respuesta esperada:
```json
{
  "success": true,
  "data": {
    "result": 10,
  "operation": "dividir 3",
    "canUndo": true,
    "canRedo": false
  }
}
```

---

## 6. Ver historial completo
GET http://localhost:3000/api/calculator/history

### Respuesta esperada:
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "state": 0,
        "operation": "initial",
        "timestamp": "2025-11-06T...",
        "isCurrent": false
      },
      {
        "state": 10,
  "operation": "sumar 10",
        "timestamp": "2025-11-06T...",
        "isCurrent": false
      },
      {
        "state": 50,
  "operation": "multiplicar 5",
        "timestamp": "2025-11-06T...",
        "isCurrent": false
      },
      {
        "state": 30,
  "operation": "restar 20",
        "timestamp": "2025-11-06T...",
        "isCurrent": false
      },
      {
        "state": 10,
  "operation": "dividir 3",
        "timestamp": "2025-11-06T...",
        "isCurrent": true
      }
    ],
    "info": {
      "totalStates": 5,
      "currentIndex": 4,
      "canUndo": true,
      "canRedo": false
    }
  }
}
```

---

## 7. Deshacer (Undo) - Volver a 30
POST http://localhost:3000/api/calculator/undo

### Respuesta esperada:
```json
{
  "success": true,
      "message": "Operación deshecha",
  "data": {
    "currentValue": 30,
        "lastOperation": "restaurado: restar 20",
    "canUndo": true,
    "canRedo": true
  }
}
```

---

## 8. Deshacer nuevamente - Volver a 50
POST http://localhost:3000/api/calculator/undo

### Respuesta esperada:
```json
{
  "success": true,
      "message": "Operación deshecha",
  "data": {
    "currentValue": 50,
        "lastOperation": "restaurado: multiplicar 5",
    "canUndo": true,
    "canRedo": true
  }
}
```

---

## 9. Rehacer (Redo) - Volver a 30
POST http://localhost:3000/api/calculator/redo

### Respuesta esperada:
```json
{
  "success": true,
      "message": "Operación rehecha",
  "data": {
    "currentValue": 30,
        "lastOperation": "restaurado: restar 20",
    "canUndo": true,
    "canRedo": true
  }
}
```

---

## 10. Limpiar calculadora
POST http://localhost:3000/api/calculator/clear

### Respuesta esperada:
```json
{
  "success": true,
  "message": "Calculadora reiniciada",
  "data": {
    "currentValue": 0,
    "lastOperation": "clear"
  }
}
```

---

## Pruebas de errores

### Error: División por cero
POST http://localhost:3000/api/calculator/operation
Content-Type: application/json

{
  "operation": "dividir",
  "value": 0
}

### Respuesta esperada:
```json
{
  "success": false,
  "error": {
    "message": "No se puede dividir por cero"
  }
}
```

---

### Error: Operación inválida
POST http://localhost:3000/api/calculator/operation
Content-Type: application/json

{
  "operation": "potencia",
  "value": 2
}

### Respuesta esperada:
```json
{
  "success": false,
  "message": "Operación no válida. Use: add, subtract, multiply, divide"
}
```

---

### Error: Valor no numérico
POST http://localhost:3000/api/calculator/operation
Content-Type: application/json

{
  "operation": "sumar",
  "value": "abc"
}

### Respuesta esperada:
```json
{
  "success": false,
  "message": "El valor debe ser un número válido"
}
```

---

## Comandos cURL (para terminal)

```bash
# Estado inicial
curl http://localhost:3000/api/calculator/state

# Sumar 10
curl -X POST http://localhost:3000/api/calculator/operation -H "Content-Type: application/json" -d "{\"operation\":\"sumar\",\"value\":10}"

# Multiplicar por 5
curl -X POST http://localhost:3000/api/calculator/operation -H "Content-Type: application/json" -d "{\"operation\":\"multiplicar\",\"value\":5}"

# Deshacer
curl -X POST http://localhost:3000/api/calculator/undo

# Rehacer
curl -X POST http://localhost:3000/api/calculator/redo

# Ver historial
curl http://localhost:3000/api/calculator/history

# Limpiar
curl -X POST http://localhost:3000/api/calculator/clear
```
