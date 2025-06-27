from flask import Flask,request, session
import controller, model
import os
from api import api_app

# Rediriger la recherche des dossiers templates et static (a cause du dossier "server")
app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), '..', 'templates'), static_folder=os.path.join(os.path.dirname(__file__), '..', 'static'))
# Clé pour la création de session
app.secret_key = "Ceci_est_une_cle_secrete"
# Raccorde les routes de l'API à l'app Flask
app.register_blueprint(api_app, url_prefix="/api")


# @app.route("/")
# def index():
#     return controller.goHome()

# ********** Home page ***********
@app.route("/")
def index():
    return controller.goHome()

# ******** Connexion page ********

@app.route("/connexion")
def connexion():
    return controller.goConnexion()

@app.route("/connexion/accessAccount", methods=["POST"])
def accessAccount():
    data = request.form
    return controller.coUser(data)

@app.route("/connexion/createAccount", methods=["POST"])
def createAccount():
    data = request.form
    return controller.setAccount(data)

@app.route("/deconnexion")
def deconnexion():
    return controller.loggingOut()

# ******** Manager page *********

@app.route("/cardManager")
def cardManager():
    return controller.goManageCard()

# ******** List page ********

@app.route("/listCard")
def listCard():
    return controller.goMyCards()

# ****** Booster page *******

@app.route("/booster")
def booster():
    return controller.goBooster()


