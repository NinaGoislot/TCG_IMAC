 function toggleSkills(card) {
     const currentPopup = card.querySelector('[data-skill-popup]');
     const allPopups = document.querySelectorAll('[data-skill-popup]');
     allPopups.forEach(p => p.classList.add('hidden'));
     currentPopup.classList.toggle('hidden');
 }

 document.addEventListener('click', (e) => {
     const isCard = e.target.closest('article');
     const isPopup = e.target.closest('[data-skill-popup]');
     if (!isCard && !isPopup) {
         document.querySelectorAll('[data-skill-popup]').forEach(p => p.classList.add('hidden'));
     }
 });

let sortState = {};

function sortTable(columnIndex) {
  const table = document.querySelector("table tbody");
  const rows = Array.from(table.rows);

  // Détermine si le contenu est numérique
  const isNumeric = !isNaN(rows[0].cells[columnIndex].innerText.trim());

  // Alterner entre croissant/décroissant
  const currentState = sortState[columnIndex] || 'asc';
  const newState = currentState === 'asc' ? 'desc' : 'asc';
  sortState[columnIndex] = newState;

  rows.sort((a, b) => {
    const aVal = a.cells[columnIndex].innerText.trim();
    const bVal = b.cells[columnIndex].innerText.trim();

    if (isNumeric) {
      return newState === 'asc'
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    } else {
      return newState === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
  });

  rows.forEach(row => table.appendChild(row));
}