// *************************************************
// ********************** GET **********************
// *************************************************

async function loadDeckUser() {

    const response = await fetch(`/api/decks`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    register(`GET : Récupération des decks de l'utilisateur`, response.status);

    const decks = await response.json();

    displayDecks(decks);
}

async function openEditDeck(deckId) {
    const response = await fetch(`/api/decks/${deckId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    register(`GET : Récupération du deck ${deckId}`, response.status);

    const deck = await response.json();

    const response2 = await fetch(`/api/decks/${deckId}/possibleCards`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    register(`GET : Récupération du cards possibles du deck ${deckId}`, response.status);

    const cards = await response2.json();
    displayEditDeckForm(deck, cards);
}

async function openNewDeck() {
    const response = await fetch(`/api/cards/user`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    register(`GET : Récupération des cartes du joueur`, response.status);

    const cards = await response.json();

    displayNewDeckForm(cards);
}

// *************************************************
// ********************* PUT ***********************
// *************************************************

async function updateDeck(deck, formData, selectedCards) {
    const data = {
        id: deck.id_deck,
        name_deck: formData.get("name_deck"),
        cards: selectedCards
    };

    console.log(data.name_deck)

    const response = await fetch(`/api/decks/${deck.id_deck}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    register(`PUT : Modification du deck ${deck.id_deck}`, response.status);

    if (response.ok) {
        updateDeckRow(deck.id_deck, data.name_deck);
        closeModal('manager');
    } else {
        alert("Erreur lors de la sauvegarde");
    }
}

// *************************************************
// ********************* POST **********************
// *************************************************

async function createDeck(formData, selectedCards) {
    const data = {
        name_deck: formData.get("name_deck"),
        cards: selectedCards
    };

    const response = await fetch(`/api/deck`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    register(`POST : Ajout d'un deck`, response.status);

    if (response.ok) {
        const newDeck = await response.json();
        appendDeckRow(newDeck);
        closeModal('manager');
    } else {
        alert("Erreur lors de la sauvegarde");
    }
}

// *************************************************
// ******************** DELETE *********************
// *************************************************

async function deleteDeck(deckId) {
    if (!confirm("Supprimer ce deck ?")) return;


    const response = await fetch(`/api/deck/${deckId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    });

    register(`DELETE : Suppression du deck ${deckId}`, response.status);

    if (response.ok) {
        deleteDeckRow(deckId);
        closeModal('manager');
    } else {
        alert("Erreur lors de la suppression");
    }
}

// *************************************************
// ******************* FUNCTIONS *******************
// *************************************************

function displayDecks(decks) {
    const container = document.querySelector('.deck-list');
    container.innerHTML = '';
    for (const deck of decks) {
        const card = `
            <div data-id="${deck.id_deck}" onclick="openEditDeck(${deck.id_deck})" class="deck-card flex justify-between items-center border border-gray-300 rounded-md p-3 mb-2 cursor-pointer">
                <span class="deck-name font-bold text-white">${deck.name_deck}</span>
                <button onclick="event.stopPropagation(); deleteDeck(${deck.id_deck})" class="bg-(--red-color) hover:bg-red-700 text-white px-3 py-1 rounded-md cursor-pointer">
                    Supprimer
                </button>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", card);
    }
}

function displayEditDeckForm(deck, cards) {
    const modalBody = document.querySelector("#modal-manager .modal-body");

    modalBody.innerHTML = `
    <div class="form-de-fou">
         <form id="edit-deck-form" class="">
                    <div>
                        <label for="name_deck">Nom du deck</label>
                        <input type="text" name="name_deck" placeholder="Nom"
                            value="${deck.name_deck ?? ''}" required class="input-default">
                    </div>

                    <div>
                        <label>Cartes</label>
                        <div class="space-y-2 max-h-64 overflow-y-auto border p-2 rounded">
                            ${cards.map(card => `
                                <div class="p-2 border rounded shadow-sm bg-gray-50">
                                    <label class="flex items-start space-x-2">
                                        <input type="checkbox" name="cards" value="${card.id_card}" ${card.assigned ? 'checked' : ''} class="mt-1">
                                        <div>
                                            <strong>${card.name_card}</strong>
                                            <div class="text-sm text-gray-600">${card.pv_card} PV</div>
                                        </div>
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <input type="submit" value="Enregistrer" class="button-default w-fit mx-auto">
            </form>
     </div>
    `;

    document.getElementById("edit-deck-form").onsubmit = function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        // Récupération des compétences sélectionnées
        const selectedCards = [...this.querySelectorAll('input[name="cards"]:checked')]
            .map(cb => parseInt(cb.value));

        console.log(selectedCards)

        updateDeck(deck, formData, selectedCards);
    };

    openModal('manager');
}

function displayNewDeckForm(cards) {
    const modalBody = document.querySelector("#modal-manager .modal-body");

    modalBody.innerHTML = `
    <div class="form-de-fou">
         <form id="new-deck-form" class="">
                    <div>
                        <label for="name_deck">Nom du deck</label>
                        <input type="text" name="name_deck" placeholder="Nom"
                        required class="input-default">
                    </div>

                    <div>
                        <label>Cartes</label>
                        <div class="space-y-2 max-h-64 overflow-y-auto border p-2 rounded">
                            ${cards.map(card => `
                                <div class="p-2 border rounded shadow-sm bg-gray-50">
                                    <label class="flex items-start space-x-2">
                                        <input type="checkbox" name="cards" value="${card.id_card}" class="mt-1">
                                        <div>
                                            <strong>${card.name_card}</strong>
                                            <div class="text-sm text-gray-600">${card.pv_card} PV</div>
                                        </div>
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <input type="submit" value="Créer" class="button-default w-fit mx-auto">
            </form>
     </div>
    `;

    document.getElementById("new-deck-form").onsubmit = function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        // Récupération des compétences sélectionnées
        const selectedCards = [...this.querySelectorAll('input[name="cards"]:checked')]
            .map(cb => parseInt(cb.value));

        console.log(selectedCards)

        createDeck(formData, selectedCards);
    };

    openModal('manager');
}

function updateDeckRow(id, name) {
    const table = document.getElementById("deck-list");
    const row = table.querySelector(`div[data-id="${id}"]`);

    if (!row) return;

    row.innerHTML = `
        
                <span class="deck-name font-bold text-white">${name}</span>
                <button onclick="event.stopPropagation(); deleteDeck(${id})" class="bg-(--red-color) hover:bg-red-700 text-white px-3 py-1 rounded-md cursor-pointer">
                    Supprimer
                </button>
    `;
}

function appendDeckRow(deck) {
    const tbody = document.getElementById("deck-list");

    const row = `
        <div data-id="${deck.id_deck}" onclick="openEditDeck(${deck.id_deck})" class="deck-card flex justify-between items-center border border-gray-300 rounded-md p-3 mb-2 cursor-pointer">
                <span class="deck-name font-bold text-white">${deck.name_deck}</span>
                <button onclick="event.stopPropagation(); deleteDeck(${deck.id_deck})" class="bg-(--red-color) hover:bg-red-700 text-white px-3 py-1 rounded-md cursor-pointer">
                    Supprimer
                </button>
        </div>
    `;

    tbody.insertAdjacentHTML("beforeend", row);
}

function deleteDeckRow(id) {
    const row = document.querySelector(`.deck-list div[data-id="${id}"]`);
    if (row) {
        row.remove();
    }
}

function register(action, status) {
    console.log(`[${status}] ${action}`);
}

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Page loaded, initializing decks...");

    try {
        await loadDeckUser();
    } catch (error) {
        console.error("Erreur lors du chargement :", error);
    }
});