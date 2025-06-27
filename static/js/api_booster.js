document.addEventListener("DOMContentLoaded", async () => {
    const flipAllBtn = document.getElementById("flipAllBtn");
    const claimBtn = document.getElementById("claimBtn");
    const cardsContainer = document.querySelector(".flex.gap-6");

    // récupérer les cartes du booster
    const cards = await fetchBoosterCards();

    if (!cards || cards.length === 0) {
        alert("Erreur lors de la récupération des cartes.");
        return;
    }

    cardsContainer.innerHTML = "";

    cards.forEach(card => {
        const cardEl = createCardElement(card);
        cardsContainer.appendChild(cardEl);
    });

    // Ajoute événement au bouton "Réclamer"
    claimBtn.addEventListener("click", () => {
        window.location.href = "/"; // Retour à la page d'accueil
    });

    await loadScript('/static/js/booster.js');
});

async function fetchBoosterCards() {

    const response = await fetch(`/api/getBooster`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    register(`GET : Récupération du booster`, response.status);

    const cards = await response.json();
    console.log(cards);
    return cards;
}

function createCardElement(card) {
    const div = document.createElement("div");
    div.className = "flip-card w-48 aspect-[257/364]";
    div.onclick = () => toggleCard(div);

    div.innerHTML = `
    <div class="flip-inner relative w-full h-full">
      <div class="flip-front bg-gray-700 flex items-center justify-center text-xl font-bold cursor-pointer">?</div>
      <article class="flip-back relative group shadow-lg">
        <img src="./static/images/${card.image_card ? card.image_card : 'card-default.jpeg'}"  class="img-card" />
        
        <p class="absolute z-20 -top-4 -right-4 bg-(--red-color) text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
          ${card.pv_card}
        </p>
        <figcaption class="absolute bottom-0 w-full bg-black/60 text-white text-center text-sm py-1 font-bold z-10 rounded-b-lg">
          ${card.name_card}
        </figcaption>
      </article>
    </div>
  `;
    return div;
}

// function toggleCard(cardDiv) {
//   cardDiv.classList.toggle("flipped");
// }

// Optionnel: fonction pour retourner toutes les cartes d'un coup
// function flipAll() {
//   document.querySelectorAll(".flip-card").forEach(card => {
//     card.classList.add("flipped");
//   });
// }

// window.flipAll = flipAll;

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Échec du chargement du script : ${src}`));
        document.body.appendChild(script);
    });
}

function register(action, status) {
    console.log(`[${status}] ${action}`);
}