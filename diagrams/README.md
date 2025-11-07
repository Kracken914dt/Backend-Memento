# Diagramas UML - Calculadora con Patrón Memento

Este directorio contiene los diagramas UML en formato PlantUML que documentan la arquitectura del sistema.

## 📊 Diagramas Disponibles

### 1. Diagrama de Clases (`class-diagram.puml`)
**Propósito:** Muestra la estructura estática del sistema y las relaciones entre clases.

**Elementos clave:**
- **Patrón Memento:**
  - `Calculator` (Originator): Crea y restaura mementos
  - `CalculatorMemento` (Memento): Almacena estados inmutables
  - `History` (Caretaker): Gestiona el historial de estados
- **Controladores:** `CalculatorController` (Singleton)
- **Rutas:** `CalculatorRoutes` (Express Router)
- **Middlewares:** `ErrorHandler`
- **Configuración:** `ServerConfig`

### 2. Diagrama de Componentes (`component-diagram.puml`)
**Propósito:** Ilustra la arquitectura por capas y las dependencias entre componentes.

**Capas:**
- **Presentation Layer:** Express App, Routes, Morgan Logger
- **Business Layer:** Calculator Controller
- **Memento Pattern Layer:** Calculator, Memento, History
- **Infrastructure Layer:** Error Handler, Server Config

**Dependencias externas:** Express.js, Morgan, CORS

### 3. Diagrama de Secuencia (`sequence-diagram.puml`)
**Propósito:** Describe el flujo de ejecución para operaciones con el patrón Memento.

**Escenarios:**
1. Realizar una operación (sumar 10)
2. Deshacer operación (undo)

Muestra cómo se crean, almacenan y restauran los mementos.

## 🛠️ Cómo visualizar los diagramas

### Opción 1: VS Code (Recomendado)
1. Instala la extensión **PlantUML** en VS Code
2. Abre cualquier archivo `.puml`
3. Presiona `Alt + D` para ver la vista previa

### Opción 2: Online
1. Visita [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. Copia y pega el contenido del archivo `.puml`
3. Visualiza el diagrama generado

### Opción 3: Línea de comandos
```bash
# Instalar PlantUML (requiere Java)
npm install -g node-plantuml

# Generar PNG
puml generate diagrams/class-diagram.puml -o output/

# Generar SVG
puml generate diagrams/class-diagram.puml -o output/ -t svg
```

## 📝 Convenciones de colores

- 🟢 **Verde (#E8F5E9):** Patrón Memento / Business Logic
- 🔵 **Azul (#E3F2FD):** Presentation Layer / Controllers
- 🟡 **Amarillo (#FFF9C4):** Patterns
- 🟣 **Púrpura (#F3E5F5):** Infrastructure / Configuration
- 🟠 **Naranja (#FFCCBC):** Dependencias externas

## 🎯 Patrones de diseño aplicados

### Memento Pattern
- **Originator:** `Calculator` - crea snapshots de su estado
- **Memento:** `CalculatorMemento` - encapsula el estado inmutable
- **Caretaker:** `History` - gestiona el historial y undo/redo

### Singleton Pattern
- **CalculatorController:** una única instancia global exportada

### MVC (Model-View-Controller)
- **Model:** Calculator, CalculatorMemento, History
- **Controller:** CalculatorController
- **View:** Responses JSON (API REST)

## 🔄 Actualizar diagramas

Si modificas el código, actualiza los diagramas correspondientes:

1. **Nuevas clases:** Agregar al diagrama de clases
2. **Nuevos componentes:** Agregar al diagrama de componentes
3. **Nuevos flujos:** Crear nuevos diagramas de secuencia

## 📚 Recursos

- [PlantUML Language Reference](https://plantuml.com/es/)
- [PlantUML Class Diagram](https://plantuml.com/es/class-diagram)
- [PlantUML Component Diagram](https://plantuml.com/es/component-diagram)
- [PlantUML Sequence Diagram](https://plantuml.com/es/sequence-diagram)
