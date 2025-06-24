from flask import Flask,request,render_template,jsonify,abort,session
import model

userConnected = 0
message = ""

# *************************************************
# ********************* VUES **********************
# *************************************************

def goHome():
    is_connected = session.get("is_connected", False)
    is_admin = session.get("is_admin", False)
    pseudo = session.get("pseudo", "")
    session["message"] = ""

    
    return render_template('index.html', is_connected=is_connected, is_admin=is_admin, pseudo=pseudo)

def goBooster():
    return render_template('booster.html')

def goConnexion():
    return render_template('connexion.html', message=session.get("message", ""))

def goMyCards():
    is_connected = session.get("is_connected", False)
    is_admin = session.get("is_admin", False)

    return render_template('listCard.html', is_connected=is_connected, is_admin=is_admin)

def goManageCard():
    is_connected = session.get("is_connected", False)

    return render_template('manageCard.html', is_connected=is_connected)


# *************************************************
# ******************* FUNCTIONS *******************
# *************************************************

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
    return goHome()

def loggingOut():
    session["is_connected"] = False
    return goHome()