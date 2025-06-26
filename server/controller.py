from flask import Flask,request,render_template,jsonify,abort,session, redirect
import model

userConnected = 0
message = ""

# *************************************************
# ********************* VUES **********************
# *************************************************

def goHome():
    session.pop('message', default=None)
    return render_template('index.html')

def goBooster():
    return render_template('booster.html')

def goConnexion():
    return render_template('connexion.html')

def goMyCards():
    cards = model.get_all_cards(session["user_id"])
    return render_template('listCard.html', cards=cards)

def goManageCard():
    cards = model.get_all_cards()
    skills = model.get_all_skills()
    return render_template('manageCard.html', cards=cards, skills=skills)


# *************************************************
# ******************* FUNCTIONS *******************
# *************************************************

# ************ Connexion / Inscription ************

def setAccount(data):
    global message
    id = data.get("id_user")
    pseudo = data.get("pseudo_user")
    mdp = data.get("mdp_user")
    mdp2 = data.get("mdp_user_2")

    if mdp != mdp2:
        session["message"] = "Les mots de passe ne correspondent pas."
        return goConnexion()

    model.createUser(id, pseudo, mdp)
    session["message"] = "Compte créé avec succès !"
    return goConnexion()

def coUser(data):
    # global message 
    # global userConnected

    id = data.get("id_user")
    mdp = data.get("mdp_user")

    # Check if user exists
    userOk = model.checkUser(id)
    if (not userOk) :
      session["message"] = "L'utilisateur n'existe pas."
      return goConnexion()
    
    # Check if password is correct
    pwOk = model.checkPassword(id, mdp)
    if (not pwOk) :
      session["message"] = "Mot de passe incorrect."
      return goConnexion()
    
    pseudo = model.getUserPseudo(id)
    isAdmin = model.getUserAdminStatus(id)
    
    session["user_id"] = id
    session["pseudo"] = pseudo
    session["is_admin"] = isAdmin
    session["is_connected"] = True
    session["message"] = "Connexion réussie !"
    return redirect("/", code=302)

def loggingOut():
    session.pop('is_connected', default=None)
    session.pop('pseudo', default=None)
    session.pop('is_admin', default=None)
    session.pop('user_id', default=None)
    return redirect("/", code=302)


# ************ CardManager ************

def createCard():
    skills = model.get_all_skills()
    rarities = model.get_all_rarities()
    categories = model.get_all_categories()
    card = {}

    return render_template('one_card.html', card=card, skills=skills, rarities=rarities, categories=categories)

def editCard(id):
    card = model.getCardById(id)
    skills = model.get_all_skills()
    rarities = model.get_all_rarities()
    categories = model.get_all_categories()

    return render_template('one_card.html', card=card, skills=skills, rarities=rarities,categories=categories)

def editSkill(id):
    skill = model.getSkillById()

    return render_template('one_skill.html', skill=skill)

def applyEditCard(id, data):
    name = data.get("name_card")
    pv = data.get("pv_card")
    img = data.get("image_card")
    cat = data.get("category")
    rar = data.get("rarity")

    if (model.checkCardExists(id)) :
        model.createCard(name, pv, img, cat, rar)
    else :
        model.updateCard(id, name, pv, img, cat, rar)
    
    return redirect("/manageCard", code=302)

def applyEditSkill(id, data):
    name = data.get("name_skill")
    desc = data.get("desc_skill")
    pow = data.get("power_skill")
    cost = data.get("cost_skill")

    model.updateCard(id, name, desc, pow, cost)

    return redirect("/manageCard", code=302)

def deleteCard(id):
    model.deleteCard(id)
    return redirect("/manageCard", code=302)

def deleteSkill(id):
    model.deleteSkill(id)
    return redirect("/manageCard", code=302)
