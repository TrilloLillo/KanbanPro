const columnContainers = document.querySelectorAll('.kanban-cards-container');

columnContainers.forEach(container => {
    new Sortable(container, {
        group: 'shared', // Permite mover entre diferentes listas
        animation: 150,  // Suavidad al mover
        ghostClass: 'bg-light', // Clase visual mientras arrastras
        onEnd: function (evt) {
            const cardId = evt.item.getAttribute('data-id');
            const newListId = evt.to.getAttribute('data-list-id');

            // Aquí llamarías a tu API de KanbanPro para actualizar la DB
            updateCardPosition(cardId, newListId);
        }
    });
});
// cardController.js (Sugerencia)
updatePosition: async (req, res) => {
    const { id } = req.params;
    const { newListId } = req.body;
    try {
        await Card.update({ list_id: newListId }, { where: { id } });
        res.status(200).json({ message: "Posición actualizada" });
    } catch (error) {
        res.status(500).json({ error: "Error al mover la tarjeta" });
    }
}