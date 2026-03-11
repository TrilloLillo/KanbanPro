require("dotenv").config();
const { sequelize, Usuario, Tablero, Lista, Tarjeta } = require('../src/models');

const poblarBaseDeDatos = async () => {
  try {
    // 1. Limpiar y sincronizar
    await sequelize.sync({ force: true });
    console.log("♻️  Base de datos reseteada y lista.");

    // 2. Usuarios (David el PM y un Desarrollador de prueba)
    const usuarios = await Usuario.bulkCreate([
      { name: 'David PM', email: 'david@kanbanpro.com'},
      { name: 'Dev Senior', email: 'dev@kanbanpro.com'}
    ]);

    const [david, dev] = usuarios;

    // 3. Tableros (Uno para el producto y otro para marketing)
    const tableroPro = await Tablero.create({ titulo: 'Desarrollo KanbanPro 🚀', UsuarioId: david.id });
    const tableroMkt = await Tablero.create({ titulo: 'Campaña de Lanzamiento 📢', UsuarioId: david.id });

    // 4. Listas para el Tablero de Desarrollo
    const listaBacklog = await Lista.create({ titulo: 'Backlog', TableroId: tableroPro.id });
    const listaProgreso = await Lista.create({ titulo: 'En Progreso', TableroId: tableroPro.id });
    const listaReview = await Lista.create({ titulo: 'En Revisión', TableroId: tableroPro.id });
    const listaHecho = await Lista.create({ titulo: 'Terminado', TableroId: tableroPro.id });

    // 5. Tarjetas (Poblando con datos de prueba realistas)
    await Tarjeta.bulkCreate([
      // En Backlog
      { titulo: 'Implementar Auth JWT', descripcion: 'Seguridad para el login', ListaId: listaBacklog.id },
      { titulo: 'Optimizar Imágenes', descripcion: 'Usar WebP para el dashboard', ListaId: listaBacklog.id },
      
      // En Progreso
      { titulo: 'Configurar Sequelize', descripcion: 'Relaciones HT-01 terminadas', ListaId: listaProgreso.id },
      { titulo: 'Crear Script de Seed', descripcion: 'Poblar tablas con datos dummy', ListaId: listaProgreso.id },

      // En Revisión
      { titulo: 'Diseño de Base de Datos', descripcion: 'Validar con el equipo de Arquitectura', ListaId: listaReview.id },

      // Terminado
      { titulo: 'Prototipo Figma', descripcion: 'Sprint 1 finalizado con éxito', ListaId: listaHecho.id },
      { titulo: 'Kick-off Sprint 2', descripcion: 'Reunión con stakeholders', ListaId: listaHecho.id }
    ]);

    // 6. Datos extra para el Tablero de Marketing (Para probar la separación de datos)
    const listaMktTodo = await Lista.create({ titulo: 'Ideas', TableroId: tableroMkt.id });
    await Tarjeta.create({ 
      titulo: 'Anuncio en LinkedIn', 
      descripcion: 'Campaña para atraer Early Adopters', 
      ListaId: listaMktTodo.id 
    });

    console.log("✅ ¡Éxito! Base de datos poblada con:");
    console.log(`- ${usuarios.length} Usuarios`);
    console.log(`- 2 Tableros`);
    console.log(`- 5 Listas`);
    console.log(`- 8 Tarjetas de prueba`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seeding:", error);
    process.exit(1);
  }
};

poblarBaseDeDatos();