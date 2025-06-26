    // *************************************************
    // ********************** GET **********************
    // *************************************************

    async function openEditCard(cardId) {
        const response = await fetch(`/api/card/${cardId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        register(`GET : Récupération de la carte ${cardId}`, response.status);

        const data = await response.json();
        displayEditCardForm(data.card, data.categories, data.rarities, cardId, data.skills);
    }

    async function openEditSkill(skillId) {
        const response = await fetch(`/api/skill/${skillId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        register(`GET : Récupération de la compétence ${skillId}`, response.status);

        const data = await response.json();
        displayEditSkillForm(data.skill);
    }

    async function openNewCard() {
        const response = await fetch(`/api/categories`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        register(`GET : Récupération des catégories`, response.status);

        const cats = await response.json();

        const response2 = await fetch(`/api/rarities`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        register(`GET : Récupération des raretés`, response2.status);

        const rars = await response2.json();

        const response3 = await fetch(`/api/skills`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        register(`GET : Récupération des compétences`, response2.status);

        const skills = await response3.json();

        displayNewCardForm(cats, rars, skills);
    }

    // *************************************************
    // ********************** PUT **********************
    // *************************************************

    async function updateCard(cardId, formData, selectedSkills) {
        const data = {
            name_card: formData.get("name_card"),
            pv_card: formData.get("pv_card"),
            image_card: formData.get("image_card"),
            id_cat: formData.get("category"),
            nom_cat: formData.get("nom_cat"),
            id_rarity: formData.get("rarity"),
            date_release: formData.get("date_release"),
            skills: selectedSkills
        };

        const response = await fetch(`/api/card/${cardId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        register(`PUT : Modification de la carte ${cardId}`, response.status);

        if (response.ok) {
            updateCardRow(cardId, data);
            closeModal('manager');
        } else {
            alert("Erreur lors de la sauvegarde");
        }
    }

    async function updateSkill(skillId, formData) {
        const data = Object.fromEntries(formData.entries());

        const response = await fetch(`/api/skill/${skillId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        register(`PUT : Modification de la compétence ${skillId}`, response.status);

        if (response.ok) {
            updateSkillRow(skillId, data);
            closeModal('manager');
        } else {
            alert("Erreur lors de la sauvegarde");
        }
    }

    // *************************************************
    // ********************* POST **********************
    // *************************************************

    async function addCard(formData, selectedSkills) {
        const data = {
            name_card: formData.get("name_card"),
            pv_card: formData.get("pv_card"),
            image_card: formData.get("image_card"),
            id_cat: formData.get("category"),
            id_rarity: formData.get("rarity"),
            skills: selectedSkills
        };

        const response = await fetch(`/api/card`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        register(`POST : Ajout d'une carte`, response.status);

        if (response.ok) {
            const newCard = await response.json();
            appendCardRow(newCard);
            closeModal('manager');
        } else {
            alert("Erreur lors de la sauvegarde");
        }
    }

    async function addSkill(formData) {
        const data = Object.fromEntries(formData.entries());

        const response = await fetch(`/api/skill`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        register(`POST : Ajout d'une compétence`, response.status);

        if (response.ok) {
            const newSkill = await response.json();
            appendSkillRow(newSkill);
            closeModal('manager');
        } else {
            alert("Erreur lors de la sauvegarde");
        }
    }

    // *************************************************
    // ******************** DELETE *********************
    // *************************************************

    async function deleteCard(id) {
        const response = await fetch(`/api/card/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        register(`DELETE : Supression de la carte ${id}`, response.status);

        if (response.ok) {
            deleteCardRow(id);
            closeModal('manager');
        } else {
            alert("Erreur lors de la sauvegarde");
        }
    }

    async function deleteSkill(id) {
        const response = await fetch(`/api/skill/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        register(`DELETE : Supression de la compétence ${id}`, response.status);

        if (response.ok) {
            deleteSkillRow(id);
            closeModal('manager');
        } else {
            alert("Erreur lors de la sauvegarde");
        }
    }

    // *************************************************
    // ******************* FUNCTION ********************
    // *************************************************

    function displayEditCardForm(card, categories, rarities, cardId, skills) {
        const modalBody = document.querySelector("#modal-manager .modal-body");

        modalBody.innerHTML = `
        <h1 class="h1-form">${card.id_card ? "Modifier la carte" : "Création d'une carte"}</h1>
        <div class="form-de-fou">
            ${card.image_card ? `
            <img src="/static/images/${card.image_card}" alt=""
                class="max-h-[600px] inset-0 object-cover rounded w-[500px] aspect-[257/364]">
            ` : `
            <img src="/static/images/card-default.jpeg" alt=""
                class="max-h-[600px] inset-0 object-cover rounded w-[500px] aspect-[257/364]">
            `}

            <div class="flex flex-col w-full">
                <form id="edit-card-form" class="">
                    <input type="text" name="date_release" class="hidden"
                            value="${card.date_release ?? ''}">
                    ${categories.map(cat => {
                        if (cat.id_cat == card.id_cat) {
                            return `<input type="text" name="nom_cat" class="hidden" value="${cat.nom_cat}">`;
                        }
                        return ''; 
                    }).join('')}
                    <div>
                        <label for="name_card">Nom de la carte</label>
                        <input type="text" name="name_card" placeholder="Nom"
                            value="${card.name_card ?? ''}" required class="input-default">
                    </div>

                    <div>
                        <label for="pv_card">Points de vie</label>
                        <input type="number" name="pv_card" placeholder="PV"
                            value="${card.pv_card ?? ''}" required class="input-default">
                    </div>

                    <div>
                        <label for="image_card" >Lien de l'image</label>
                        <input type="text" name="image_card"
                            value="${card.image_card ?? ''}" class="input-default">
                    </div>

                    <div>
                        <label for="category">Catégorie</label>
                        <select name="category" class"input-default bg-red-100">
                            ${categories.map(cat => `
                                <option value="${cat.id_cat}" ${cat.id_cat === card.id_cat ? 'selected' : ''}>${cat.nom_cat}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div>
                        <label for="rarity">Rareté</label>
                        <select name="rarity" class"input-default">
                            ${rarities.map(rar => `
                                <option value="${rar.id_rarity}" ${rar.id_rarity === card.id_rarity ? 'selected' : ''}>
                                    ${rar.level_rarity} (${rar.proba_rarity}%)
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div>
                        <label>Compétences</label>
                        <div class="space-y-2 max-h-64 overflow-y-auto border p-2 rounded">
                            ${skills.map(skill => `
                                <div class="p-2 border rounded shadow-sm bg-gray-50">
                                    <label class="flex items-start space-x-2">
                                        <input type="checkbox" name="skills" value="${skill.id_skill}" ${skill.assigned ? 'checked' : ''} class="mt-1">
                                        <div>
                                            <strong>${skill.name_skill}</strong>
                                            <div class="text-sm text-gray-600">${skill.desc_skill}</div>
                                            <div class="text-xs mt-1">
                                                ⚡ ${skill.e_cost_skill} | 🗡️ ${skill.power_skill}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <input type="submit" value="Enregistrer" class="button-default w-fit mx-auto">
                </form>
            </div>
        </div>
    `;

        document.getElementById("edit-card-form").onsubmit = function (e) {
            e.preventDefault();
            const formData = new FormData(this);

            // Récupération des compétences sélectionnées
            const selectedSkills = [...this.querySelectorAll('input[name="skills"]:checked')]
                .map(cb => parseInt(cb.value));

            updateCard(cardId, formData, selectedSkills);
        };

        openModal('manager');
    }

    function displayNewCardForm(categories, rarities, skills) {
        const modalBody = document.querySelector("#modal-manager .modal-body");

        modalBody.innerHTML = `
        <h1 class="h1-form">Création d'une carte</h1>
        <div class="form-de-fou">
            <div class="flex flex-col w-full">
                <form id="new-card-form">
                    <div>
                        <label for="name_card">Nom de la carte</label>
                        <input type="text" name="name_card" placeholder="Nom" required class="input-default">
                    </div>

                    <div>
                        <label for="pv_card">Points de vie</label>
                        <input type="number" name="pv_card" placeholder="PV" required class="input-default">
                    </div>

                    <div>
                        <label for="image_card" >Lien de l'image</label>
                        <input type="text" name="image_card" class="input-default">
                    </div>

                    <div>
                        <label for="category">Catégorie</label>
                        <select name="category" class"input-default bg-red-100">
                            ${categories.map(cat => `
                                <option value="${cat.id_cat}" ${cat.id_cat === 1 ? 'selected' : ''}>${cat.nom_cat}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div>
                        <label for="rarity">Rareté</label>
                        <select name="rarity" class"input-default">
                            ${rarities.map(rar => `
                                <option value="${rar.id_rarity}" ${rar.id_rarity === 1 ? 'selected' : ''}>
                                    ${rar.level_rarity} (${rar.proba_rarity}%)
                                </option>
                            `).join('')}
                        </select>
                    </div>
                     <div>
                        <label>Compétences</label>
                        <div class="space-y-2 max-h-64 overflow-y-auto border p-2 rounded">
                            ${skills.map(skill => `
                                <div class="p-2 border rounded shadow-sm bg-gray-50">
                                    <label class="flex items-start space-x-2">
                                        <input type="checkbox" name="skills" value="${skill.id_skill}" class="mt-1">
                                        <div>
                                            <strong>${skill.name_skill}</strong>
                                            <div class="text-sm text-gray-600">${skill.desc_skill}</div>
                                            <div class="text-xs mt-1">
                                                ⚡ ${skill.e_cost_skill} | 🗡️ ${skill.power_skill}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <input type="submit" value="Ajouter" class="button-default w-fit mx-auto">
                </form>
            </div>
        </div>
    `;

        document.getElementById("new-card-form").onsubmit = function (e) {
            e.preventDefault();
            const formData = new FormData(this);

            // Récupération des compétences sélectionnées
            const selectedSkills = [...this.querySelectorAll('input[name="skills"]:checked')]
                .map(cb => parseInt(cb.value));
            addCard(formData, selectedSkills);
        };

        openModal('manager');
    }

    function displayEditSkillForm(skill) {
        const modalBody = document.querySelector("#modal-manager .modal-body");

        modalBody.innerHTML = `
        <h1 class="h1-form">Modifier la compétence</h1>
        <div class="form-de-fou">
            <div class="flex flex-col w-full">
                <form id="edit-skill-form">
                    <div>
                        <label for="name_skill">Nom de la compétence</label>
                        <input type="text" name="name_skill" placeholder="Boom Boom"
                            value="${skill.name_skill ?? ''}" required class="input-default">
                    </div>

                    <div>
                        <label for="desc_skill">Description</label>
                        <input type="text" name="desc_skill" placeholder="Une compétence incroyable"
                            value="${skill.desc_skill ?? ''}" required class="input-default">
                    </div>

                    <div>
                        <label for="power_skill" >Puissance</label>
                        <input type="number" name="power_skill"
                            value="${skill.power_skill ?? ''}" class="input-default">
                    </div>

                    <div>
                        <label for="cost_skill">Coût d'énergies</label>
                        <input type="number" name="cost_skill"
                            value="${skill.e_cost_skill ?? ''}" class="input-default">
                    </div>

                    <input type="submit" value="Enregistrer" class="button-default w-fit mx-auto">
                </form>
            </div>
        </div>
    `;

        document.getElementById("edit-skill-form").onsubmit = function (e) {
            e.preventDefault();
            updateSkill(skill.id_skill, new FormData(this));
        };

        openModal('manager');
    }

    function displayNewSkillForm() {
        const modalBody = document.querySelector("#modal-manager .modal-body");

        modalBody.innerHTML = `
        <h1 class="h1-form">Création d'une compétence</h1>
        <div class="form-de-fou">
            <div class="flex flex-col w-full">
                <form id="new-skill-form">
                    <div>
                        <label for="name_skill">Nom de la compétence</label>
                        <input type="text" name="name_skill" placeholder="Boom Boom" required class="input-default">
                    </div>

                    <div>
                        <label for="desc_skill">Description</label>
                        <input type="text" name="desc_skill" placeholder="Une compétence incroyable"  required class="input-default">
                    </div>

                    <div>
                        <label for="power_skill" >Puissance</label>
                        <input type="number" name="power_skill" class="input-default">
                    </div>

                    <div>
                        <label for="cost_skill">Coût d'énergies</label>
                        <input type="number" name="cost_skill" class="input-default">
                    </div>

                    <input type="submit" value="Ajouter" class="button-default w-fit mx-auto">
                </form>
            </div>
        </div>
    `;

        document.getElementById("new-skill-form").onsubmit = function (e) {
            e.preventDefault();
            addSkill(new FormData(this));
        };

        openModal('manager');
    }

    function updateCardRow(id, card) {
        const table = document.getElementById("card-list");
        const row = table.querySelector(`tr[data-id="${id}"]`);

        console.log(card);

        if (!row) return;

        row.innerHTML = `
        <td class="px-4 py-2">${id}</td>
        <td class="px-4 py-2">
            <span class="border-b border-dotted border-gray-400 cursor-pointer hover:text-blue-600">
                ${card.name_card}
            </span>
        </td>
        <td class="px-4 py-2">${card.nom_cat}</td>
        <td class="px-4 py-2">${card.id_rarity}</td>
        <td class="px-4 py-2">${card.pv_card}</td>
        <td class="px-4 py-2">${card.date_release}</td>
        <td class="flex px-4 py-2 space-x-2">
            <button onclick="openEditCard(${card.id_card})" class="bg-(--primary-color) hover:bg-yellow-500 flex-1 button-action"><i class="fa-solid fa-pen"></i></button>
            <button onclick="deleteRow(${card.id_card})" class="bg-(--red-color) hover:bg-red-600 flex-1 button-action"><i class="fa-solid fa-trash"></i></button>
        </td>
    `;
    }

    function updateSkillRow(id, skill) {
        const row = document.querySelector(`#skill-list tr[data-id="${id}"]`);
        if (!row) return;

        row.innerHTML = `
        <td class="px-4 py-2">${id}</td>
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
            <button onclick="deleteRow(${skill.id_skill})" class="bg-(--red-color) hover:bg-red-600 flex-1 button-action"><i class="fa-solid fa-trash"></i></button>
        </td>
    `;
    }

    function appendCardRow(card) {
        const tbody = document.getElementById("card-list");

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
                <button onclick="deleteRow(${card.id_card})" class="bg-(--red-color) hover:bg-red-600 flex-1 button-action"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `;

        tbody.insertAdjacentHTML("beforeend", row);
    }

    function appendSkillRow(skill) {
        const tbody = document.getElementById("skill-list");

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
            <td class="flex px-4 py-2 space-x-2">
                <button onclick="openEditSkill(${skill.id_skill})" class="bg-(--primary-color) hover:bg-yellow-500 flex-1 button-action"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteRow(${skill.id_skill})" class="bg-(--red-color) hover:bg-red-600 flex-1 button-action"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `;

        tbody.insertAdjacentHTML("beforeend", row);
    }

    function deleteCardRow(id) {
        const row = document.querySelector(`#card-list tr[data-id="${id}"]`);
        if (row) {
            row.remove();
        }
    }

    function deleteSkillRow(id) {
        const row = document.querySelector(`#skill-list tr[data-id="${id}"]`);
        if (row) {
            row.remove();
        }
    }

    function register(action, status) {
        console.log(`[${status}] ${action}`);
    }