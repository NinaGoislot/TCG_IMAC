from flask import Flask,request,render_template,jsonify,abort,session
import controller, model
import os

# app = Flask(__name__)
app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), '..', 'templates'), static_folder=os.path.join(os.path.dirname(__file__), '..', 'static'))
app.secret_key = "Ceci_est_une_cle_secrete"

# @app.route("/")
# def index():
#     return controller.goHome()

@app.route("/")
def index():
    return controller.goHome()

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

@app.route("/cardManager")
def cardManager():
    return controller.goManageCard()

@app.route("/cardManager/editCard/<int:id>")
def editCard(id):
    return controller.editCard(id)

@app.route("/cardManager/editSkill/<int:id>")
def editSkill(id):
    return controller.editSkill(id)

@app.route("/listCard")
def listCard():
    return controller.goMyCards()

@app.route("/booster")
def booster():
    return controller.goBooster()


