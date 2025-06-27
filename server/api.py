from flask import request, jsonify, Blueprint, session
from datetime import date, datetime, timedelta
import random
import model

api_app = Blueprint("api", __name__)


# *************************************************
# ********************* GET ***********************
# *************************************************

@api_app.route("/card/<int:id>", methods=["GET"])
def get_card(id):
    card = model.getCardById(id)
    if not card:
        return jsonify({"error": "Card not found"}), 404
    
    card["date_release"] = card["date_release"].strftime("%Y-%m-%d")
    
    skills = model.get_skills_assigned_card(id)
    rarities = model.get_all_rarities()
    categories = model.get_all_categories()

    return jsonify({
        "card": card,
        "skills": skills,
        "rarities": rarities,
        "categories": categories
    })

@api_app.route("/skill/<int:id>", methods=["GET"])
def get_skill(id):
    skill = model.getSkillById(id)
    if not skill:
        return jsonify({"error": "Skill not found"}), 404

    return jsonify({
        "skill": skill
    })

@api_app.route("/user/<int:id>", methods=["GET"])
def get_user(id):
    user = model.getUserById(id)
    if not user:
        return jsonify({"error": "Usernot found"}), 404

    return jsonify({
        "user": user
    })

@api_app.route("/username/<int:id>", methods=["GET"])
def get_user_pseudo(id):
    username = model.getUserPseudo(id)
    if not username:
        return jsonify({"error": "Username not found"}), 404

    return jsonify({
        "user": username
    })

@api_app.route("/getBooster", methods=["GET"])
def get_booster():
    id_user = session["id_user"]

    rarities = model.get_all_rarities()

    total_weight = sum(rarity['proba_rarity'] for rarity in rarities)
    for rarity in rarities:
        rarity['proba_normalize'] = rarity['proba_rarity'] / total_weight

    def choose_rarity():
        nb = random.random()
        cumulative = 0
        for rarity in rarities:
            cumulative += rarity['proba_normalize']
            if nb <= cumulative:
                return rarity['id_rarity']
        return rarities[1]
    
    cards_drawn = []
    nb_cards_booster = 3

    for _ in range(nb_cards_booster):
        rar_id = choose_rarity()
        cards = model.getCardsByRarity(rar_id)
        if not cards:
            continue
        card = random.choice(cards)
        cards_drawn.append(card)

        model.addCardToUser(id_user, card['id_card'])

    model.setLastBoosterTime(id_user)

    return jsonify(cards_drawn)

@api_app.route("/categories", methods=["GET"])
def get_all_categories():
    categories = model.get_all_categories()
    if not categories:
        return jsonify({"error": "Categories not found"}), 404

    return jsonify(categories)

@api_app.route("/rarities", methods=["GET"])
def get_all_rarities():
    rarities = model.get_all_rarities()
    if not rarities:
        return jsonify({"error": "rarities not found"}), 404

    return jsonify(rarities)

@api_app.route("/cards", methods=["GET"])
def get_all_cards():
    cards = model.get_all_cards()
    if not cards:
        return jsonify({"error": "cards not found"}), 404

    # Reconversion en date uniquement 
    for card in cards:
        if isinstance(card.get("date_release"), (datetime, date)):
            card["date_release"] = card["date_release"].strftime("%Y-%m-%d")

    return jsonify(cards)

@api_app.route("/skills", methods=["GET"])
def get_all_skills():
    skills = model.get_all_skills()

    if not skills:
        return jsonify({"error": "skills not found"}), 404

    return jsonify(skills)


@api_app.route("/skillsAssigned/<int:id>", methods=["GET"])
def get_skills_assigned_card(id):
    skills = model.get_skills_assigned_card(id)

    if not skills:
        return jsonify({"error": "skills not found"}), 404

    return jsonify(skills)

@api_app.route("/canOpenBooster", methods=["GET"])
def can_open_booster():
    id_user = session["id_user"]
    last_booster = model.getUserLastBooster(id_user)

    if not last_booster:
        return True

    now = datetime.now()
    last_booster_dt = datetime.combine(now.date(), last_booster)

    if (now - last_booster_dt) >= timedelta(minutes=5):
        return False

    return True

@api_app.route("/skills/nbCards", methods=["GET"])
def get_cards_by_skill():
    skills = model.nbCardsBySkills()

    if not skills:
        return jsonify({"error": "skills not found"}), 404

    return jsonify(skills)

@api_app.route("/users/cards", methods=["GET"])
def get_users_by_cards():
    users_cards = model.usersByCards()

    if not users_cards:
        return jsonify({"error": "Cards not found"}), 404

    return jsonify(users_cards)



# *************************************************
# ******************** UPDATE *********************
# *************************************************

@api_app.route("/card/<int:id>", methods=["PUT"])
def update_card(id):
    data = request.json

    name = data.get("name_card")
    pv = int(data.get("pv_card"))
    img = data.get("image_card")
    cat = data.get("id_cat")
    rar = data.get("id_rarity")
    skill_ids = data.get("skills", [])

    model.updateCard(id, name, pv, img, cat, rar, skill_ids)
    return jsonify({"message": "Carte mise à jour"})

@api_app.route("/skill/<int:id>", methods=["PUT"])
def update_skill(id):
    data = request.json

    name = data.get("name_skill")
    desc = data.get("desc_skill")
    pow = data.get("power_skill")
    cost = data.get("cost_skill")

    model.updateSkill(id, name, desc, pow, cost)
    return jsonify({"message": "Compétence mise à jour"})

@api_app.route("/user/username/<int:id>", methods=["PUT"])
def update_user_pseudo(id):
    data = request.json

    username = data.get("pseudo")

    model.updateUserPseudo(id, username)
    return jsonify({"message": "Pseudo utilisateur mis à jour"})

@api_app.route("/user/adminStatus/<int:id>", methods=["PUT"])
def update_admin_status(id):
    data = request.json
    is_admin = data.get("is_admin")

    model.updateUserStatus(id, is_admin)
    return jsonify({"message": "Statut utilisateur mis à jour"})

@api_app.route("/user/password/<int:id>", methods=["PUT"])
def update_user_password(id):
    data = request.json
    pw = data.get("password")

    model.updateUserMdp(id, pw)
    return jsonify({"message": "Mot de passe utilisateur mis à jour"})

@api_app.route("/user/<int:id>", methods=["PUT"])
def update_user(id):
    data = request.json
    username = data.get("pseudo")
    pw = data.get("password")
    admin = data.get("is_admin")

    model.updateUserMdp(id, username, admin, pw)
    return jsonify({"message": "Utilisateur mis à jour"})


# *************************************************
# ******************* CREATE **********************
# *************************************************

@api_app.route("/card", methods=["POST"])
def add_Card():
    data = request.json

    name = data.get("name_card")
    pv = data.get("pv_card")
    img = data.get("image_card")
    cat = data.get("id_cat")
    rar = data.get("id_rarity")
    skill_ids = data.get("skills", [])

    addedCard = model.createCard(name, pv, img, cat, rar, skill_ids)
    addedCard["date_release"] = addedCard["date_release"].strftime("%Y-%m-%d")
    
    return jsonify(addedCard)

@api_app.route("/skill", methods=["POST"])
def add_Skill():
    data = request.json

    name = data.get("name_skill")
    desc = data.get("desc_skill")
    pow = data.get("power_skill")
    cost = data.get("cost_skill")

    addedSkill = model.createSkill(name, desc, pow, cost)

    return jsonify(addedSkill)

@api_app.route("/user", methods=["POST"])
def add_User():
    data = request.json

    id = data.get("identifiant")
    username = data.get("pseudo")
    pw = data.get("password")

    model.createUser(id, username, pw)

    return jsonify({"message": "Utilisateur ajouté"})

# *************************************************
# ******************** DELETE *********************
# *************************************************

@api_app.route("/card/<int:id>", methods=["DELETE"])
def delete_card(id):
    model.deleteCard(id)
    return jsonify({"message": "Card supprimée"})

@api_app.route("/skill/<int:id>", methods=["DELETE"])
def delete_skill(id):
    model.deleteSkill(id)
    return jsonify({"message": "Compétence supprimée"})

@api_app.route("/user/<int:id>", methods=["DELETE"])
def delete_user(id):
    model.deleteUser(id)
    return jsonify({"message": "Utilisateur supprimé"})