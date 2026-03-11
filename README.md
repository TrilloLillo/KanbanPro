# 💼 EF- M7 Proyecto integrador Sprint 2
## Proyecto: "KanbanPro" - Kick-off del Sprint 2

Asunto: 📧 ¡Prototipo aprobado! Iniciando Fase 2: Arquitectura de Datos

De: David, Product Manager de KanbanPro Para: El Equipo de Desarrollo (Tú)

¡Hola equipo!

Excelentes noticias: a los stakeholders les encantó el prototipo visual del Sprint 1. La navegación es clara y el diseño del dashboard es exactamente lo que buscábamos. ¡Buen trabajo!

Ahora es el momento de pasar a la siguiente fase. Con el diseño validado, tenemos luz verde para construir la capa de persistencia. En este sprint, nos centraremos exclusivamente en la base de datos. Necesitamos definir cómo se estructurará, almacenará y relacionará toda la información de nuestros usuarios y sus proyectos.

Este es un paso crítico y fundamental para el éxito de KanbanPro. Por ahora, no se preocupen por conectar esto a la interfaz web; el objetivo es crear un modelo de datos sólido y probarlo de forma aislada para garantizar su integridad.

¡A construir la base de nuestro proyecto!

Saludos, David

Resumen del Sprint 2: Modelo de Datos y Capa de Persistencia

## Objetivo del Sprint: Crear la arquitectura completa de la base de datos utilizando PostgreSQL y el ORM Sequelize. El entregable será un conjunto de modelos de datos funcionales y scripts para crear, poblar y probar la base de datos, garantizando que la lógica de negocio esté correctamente representada. La interfaz web visible no sufrirá cambios y seguirá mostrando datos simulados.

### Historias Técnicas a Implementar

### HT-01: Definición de la Arquitectura de Datos con ORM

    Como desarrollador,

    Necesito definir los modelos y sus relaciones usando Sequelize,

    Para que la aplicación tenga una forma estructurada y predecible de manejar los datos de Usuarios, Tableros, Listas y Tarjetas.

### Criterios de Aceptación:

    ✅ Se deben instalar las dependencias sequelize, pg y pg-hstore.

    ✅ Se debe configurar y verificar una conexión exitosa a la base de datos PostgreSQL.

    ✅ Deben existir los archivos de modelo para Usuario, Tablero, Lista y Tarjeta en una carpeta /models.

    ✅ Se deben establecer correctamente las relaciones "uno a muchos" (hasMany / belongsTo) entre los modelos:

        Usuario ↔ Tablero

        Tablero ↔ Lista

        Lista ↔ Tarjeta

### HT-02: Creación y Poblado Automatizado de la Base de Datos

    Como desarrollador,

    Necesito un script que cree el esquema de la base de datos y la pueble con datos de prueba,

    Para disponer de un entorno de desarrollo consistente y poder probar la lógica con datos realistas.

### Criterios de Aceptación:

    ✅ El método sequelize.sync() debe ser utilizado para crear las tablas en la base de datos a partir de los modelos.

    ✅ Debe existir un script separado (ej: seed.js) que, al ejecutarse (node seed.js), popule las tablas con datos de ejemplo (al menos 2 usuarios, 3 tableros y varias listas/tarjetas).

### HT-03: Verificación de la Lógica del Modelo de Datos

    Como desarrollador,

    Necesito scripts de prueba para realizar operaciones CRUD directamente en la base de datos,

    Para asegurar la integridad del modelo y sus relaciones antes de exponerlos a través de una API.

### Criterios de Aceptación:

    ✅ Debe existir un script separado (ej: test-crud.js).

    ✅ Este script, al ejecutarse, debe demostrar de forma aislada (sin usar Express) al menos una operación de cada tipo:

        Crear: Crear una nueva Tarjeta y asociarla a una Lista existente.

        Leer: Leer un Tablero incluyendo sus Listas y Tarjetas asociadas (usando include).

        Actualizar: Modificar el título de una Tarjeta o Lista.

        Borrar: Eliminar una Tarjeta o Lista.

    ✅ La salida en la consola del script debe verificar que las operaciones se completaron con éxito.
