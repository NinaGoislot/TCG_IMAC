// *************************************************
// ********************** GET **********************
// *************************************************

async function loadCardSkills() {
    console.log("Chargement des compétences par carte...");

    const cardElements = document.querySelectorAll("article[data-id]");

    for (const cardEl of cardElements) {
        const cardId = cardEl.getAttribute("data-id");

        

        try {
            const response = await fetch(`/api/card/${cardId}/skills`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            register(`GET : Compétences pour carte ${cardId}`, response.status);

            if (!response.ok) throw new Error(`Erreur de chargement pour la carte ${cardId}`);

            const skills = await response.json();
            console.log(cardEl);
            console.log(skills);
            displayCardSkills(cardEl, skills);

        } catch (err) {
            console.error(`Erreur lors du chargement des compétences pour la carte ${cardId} :`, err);
        }
    }
}

// *************************************************
// ******************* FUNCTIONS *******************
// *************************************************

function displayCardSkills(cardElement, skills) {
    const skillPopup = cardElement.querySelector("[data-skill-popup]");

    if (!skillPopup) return;

    if (skills.length > 0) {
        skillPopup.innerHTML = `
            <p class="font-bold mb-2">Compétences :</p>
            <ul class="list-disc pl-5 space-y-1">
                ${skills.map(skill => `<li>${skill.name_skill}</li>`).join("")}
            </ul>
        `;
    } else {
        skillPopup.innerHTML = `<p class="italic text-gray-500">Aucune compétence</p>`;
    }
}

function register(action, status) {
    console.log(`[${status}] ${action}`);
}


// *************************************************
// **************** INIT AU CHARGEMENT *************
// *************************************************

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Page chargée. Initialisation des compétences par carte...");
    await loadCardSkills();
});
