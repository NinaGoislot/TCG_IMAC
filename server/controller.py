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
    cards = model.get_all_cards(session["id_user"])
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
    
    session["id_user"] = id
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
