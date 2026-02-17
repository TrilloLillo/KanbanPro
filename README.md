# 💼 EF- M6 Proyecto integrador Sprint 1
## Proyecto: "KanbanPro" - Kick-off del Sprint 1

### Asunto: 📧 ¡Luz verde para el prototipo funcional de KanbanPro!

#### De: David, Product Manager de KanbanPro Para: El Equipo de Desarrollo (Tú)

¡Hola equipo!

Estoy muy emocionado de dar inicio al desarrollo de KanbanPro. Para arrancar con fuerza, necesitamos construir un prototipo funcional que nos permita validar tanto el diseño visual como la experiencia de usuario principal.

El objetivo de este primer sprint es crear una aplicación navegable que no solo luzca como el producto final, sino que también demuestre la funcionalidad clave: la capacidad de añadir una tarea y que esta persista. Para esta fase inicial, utilizaremos un archivo JSON local en el servidor como nuestra "base de datos". Esto nos dará una prueba de concepto sólida sobre la cual construir.

¡Vamos a crear la primera versión funcional de KanbanPro!

Saludos, David

### Resumen del Sprint 1: Prototipo Funcional con Persistencia en Archivos

#### Objetivo del Sprint: Construir la aplicación web inicial renderizada desde el servidor, incluyendo la interfaz de usuario, la navegación y un mecanismo de persistencia de datos local utilizando el sistema de archivos de Node.js y un archivo JSON.

#### Historias de Usuario a Implementar

##### HU-01: Navegación y Estructura Visual

    Como un visitante,

    Quiero poder navegar a las páginas de Inicio, Registro e Inicio de Sesión,

    Para entender la estructura del sitio y cómo acceder a la aplicación.

Criterios de Aceptación:

    ✅ Debe existir una ruta GET / que renderice una vista home.hbs.

    ✅ Deben existir las rutas GET /register y GET /login que rendericen sus vistas correspondientes.

    ✅ Todas las vistas deben heredar de un layout.hbs principal para mantener un diseño consistente.

##### HU-02: Visualización de Datos Persistentes en el Dashboard

    Como un usuario (simulado),

    Quiero que el dashboard cargue y muestre los datos del proyecto desde una fuente de datos permanente,

    Para que la información sea consistente cada vez que visito la página.

Criterios de Aceptación:

    ✅ Debe existir un archivo data.json en el proyecto que contenga la estructura inicial de los tableros, listas y tarjetas.

    ✅ La ruta GET /dashboard debe leer el archivo data.json utilizando el módulo fs de Node.js (fs.readFileSync).

    ✅ El contenido leído (string) debe ser parseado (JSON.parse) a un objeto de JavaScript.

    ✅ Este objeto debe pasarse a la vista dashboard.hbs, la cual usará {{#each}} para renderizar dinámicamente el contenido.

##### HU-03: Creación y Persistencia de Nuevas Tareas

    Como un usuario (simulado),

    Quiero poder añadir una nueva tarjeta a una lista a través de un formulario,

    Para que mi nueva tarea quede guardada y sea visible si recargo la página.

Criterios de Aceptación:

    ✅ La vista dashboard.hbs debe incluir un formulario HTML (<form method="POST">) para añadir una nueva tarjeta.

    ✅ El formulario debe enviar los datos a una ruta POST (ej: /nueva-tarjeta).

    ✅ La lógica de esta ruta POST debe seguir el ciclo "Leer-Modificar-Escribir":

        Leer y parsear el contenido actual de data.json.

        Modificar el objeto de datos, añadiendo la nueva tarjeta.

        Convertir el objeto modificado de vuelta a un string JSON (JSON.stringify).

        Escribir el nuevo string sobreescribiendo el archivo data.json (fs.writeFileSync).

    ✅ Tras guardar, la ruta debe redirigir (res.redirect) al usuario de vuelta al /dashboard.

### Requisitos Técnicos y Estructura

    Entorno: Inicializa un proyecto de Node.js e instala express y hbs.

    Estructura de Carpetas: El proyecto debe tener una estructura organizada (views/, public/, app.js, data.json).

    Conceptos a Aplicar:

        Node.js y Express: Servidor, ruteo (GET, POST), middleware (express.urlencoded).

        Handlebars (hbs): Motor de vistas, layouts y helpers ({{#each}}).

        Módulo fs (File System): fs.readFileSync y fs.writeFileSync.

        JSON: JSON.parse y JSON.stringify.
