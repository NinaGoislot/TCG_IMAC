function toggleCard(card) {
  // Ne rien faire si déjà retournée
  if (card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  checkAllFlipped();
}

function flipAll() {
  document.querySelectorAll('.flip-card').forEach(card => {
    if (!card.classList.contains('flipped')) {
      card.classList.add('flipped');
    }
  });
  checkAllFlipped();
}

function checkAllFlipped() {
  const allCards = document.querySelectorAll('.flip-card');
  const allFlipped = Array.from(allCards).every(card => card.classList.contains('flipped'));

  if (allFlipped) {
    document.getElementById('flipAllBtn').classList.add('hidden');
    document.getElementById('claimBtn').classList.remove('hidden');
  }
}
