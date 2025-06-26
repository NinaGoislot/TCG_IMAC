function openModal(modalId) {
    document.getElementById(`modal-${modalId}`).classList.remove('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(`modal-${modalId}`).classList.add('hidden');
    document.getElementById('modal-overlay').classList.add('hidden');
}