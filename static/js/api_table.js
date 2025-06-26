// *************************************************
// ********************** GET **********************
// *************************************************

async function loadCards() {

    console.log("Chargement des cartes...");

    const response = await fetch(`/api/cards`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    register(`GET : Récupération des cartes`, response.status);

    const cards = await response.json();
    console.log(cards);
    displayCardsTable(cards);
}

async function loadSkills() {
    const response = await fetch(`/api/skills`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    register(`GET : Récupération des compétences`, response.status);

    const skills = await response.json();
    displaySkillsTable(skills);
}

// *************************************************
// ******************* FUNCTIONS *******************
// *************************************************

function displayCardsTable(cards) {
    const tbody = document.getElementById("card-list");
    tbody.innerHTML = "";

    for (const card of cards) {
        const row = `
            <tr data-id="${card.id_card}">
                <td class="px-4 py-2">${card.id_card}</td>
                <td class="px-4 py-2">
                    <span class="border-b border-dotted border-gray-400 cursor-pointer hover:text-blue-600">
                        ${card.name_card}
                    </span>
                </td>
                <td class="px-4 py-2">${card.category}</td>
                <td class="px-4 py-2">${card.id_rarity}</td>
                <td class="px-4 py-2">${card.pv_card}</td>
                <td class="px-4 py-2">${card.date_release}</td>
                <td class="flex px-4 py-2 space-x-2">
                    <button onclick="openEditCard(${card.id_card})" class="bg-(--primary-color) hover:bg-yellow-500 flex-1 button-action"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteCard(${card.id_card})" class="bg-(--red-color) hover:bg-red-600 flex-1 button-action"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
    }

}

function displaySkillsTable(skills) {
    const tbody = document.getElementById("skill-list");
    tbody.innerHTML = "";

    for (const skill of skills) {
        const row = `
            <tr data-id="${skill.id_skill}">
                <td class="px-4 py-2">${skill.id_skill}</td>
                <td class="px-4 py-2">
                    <span class="border-b border-dotted border-gray-400 cursor-pointer hover:text-blue-600">
                        ${skill.name_skill}
                    </span>
                </td>
                <td class="px-4 py-2">${skill.desc_skill}</td>
                <td class="px-4 py-2">${skill.power_skill}</td>
                <td class="px-4 py-2">${skill.e_cost_skill}</td>
                <td class="flex px-4 py-2 space-x-2">
                    <button onclick="openEditSkill(${skill.id_skill})" class="bg-(--primary-color) hover:bg-yellow-500 flex-1 button-action"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteSkill(${skill.id_skill})" class="bg-(--red-color) hover:bg-red-600 flex-1 button-action"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
    }
}

function register(action, status) {
    console.log(`[${status}] ${action}`);
}


document.addEventListener("DOMContentLoaded", async function () {
    console.log("Page loaded, initializing API tables...");

    try {
        await loadCards(); 
        await loadSkills();

        // Charger dynamiquement d'autres scripts JS
        await loadScript('/static/js/api_modal.js');
        await loadScript('/static/js/main.js');

        console.log("Scripts JS supplémentaires chargés !");
    } catch (error) {
        console.error("Erreur lors du chargement :", error);
    }
});

// Fonction utilitaire pour charger un script dynamiquement
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