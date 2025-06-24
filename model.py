import mysql.connector

# *************************************************
# ********************** BDD **********************
# *************************************************

# Connexion à la base de données MySQL
mydb = mysql.connector.connect(
    host="163.172.165.87",
    user="TCG_IMAC",
    password="ImAc2025",
    database="TCG_IMAC"
)

# mydb = mysql.connector.connect(
#     host="localhost",
#     user="admin",
#     password="admin",
#     database="tcg_imac"
# )
mycursor = mydb.cursor(dictionary=True)

# *************************************************
# ******************* FUNCTIONS *******************
# *************************************************

def test():
    sql = "SELECT * FROM user"
    mycursor.execute(sql)
    return mycursor.fetchall()

# ************ Connexion / Inscription ************

def createUser(id, username, password):
    sql = "INSERT INTO user (id_user, pseudo_user, pseudo_user) VALUES (%s, %s, %s)"
    val = (id, username, password)
    mycursor.execute(sql, val)
    mydb.commit()

def checkUser(id):
    sql = "SELECT * FROM user WHERE id_user = %s"
    val = (id,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()
    return result is not None # true is user founded, else false

def checkPassword(id, password):
    sql = "SELECT * FROM user WHERE id_user = %s AND mdp_user = %s"
    val = (id, password)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()
    return result is not None

def getUserPseudo(id):
    sql = "SELECT pseudo_user FROM user WHERE id_user = %s"
    val = (id,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()
    return result[0] if result else None

def getUserAdminStatus(id):
    sql = "SELECT is_admin FROM user WHERE id_user = %s"
    val = (id,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()
    return result[0] if result else None
