from flask import Flask,request,render_template,jsonify,abort,session
import controller, model

app = Flask(__name__)
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
    return controller.loggingOut()


