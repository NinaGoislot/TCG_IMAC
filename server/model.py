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
    sql = "INSERT INTO user (id_user, pseudo_user, mdp_user) VALUES (%s, %s, %s)"
    val = (id, username, password)
    mycursor.execute(sql, val)
    mydb.commit()

def checkUser(id):
    sql = "SELECT id_user FROM user WHERE id_user = %s"
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
    print(result)
    return result['pseudo_user'] if result else None

def getUserAdminStatus(id):
    sql = "SELECT is_admin FROM user WHERE id_user = %s"
    val = (id,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()
    print(result)
    return result['is_admin'] if result else None

# ************ Booster ************

def createBooster():
    sql = "SELECR * FROM rarity"
    mycursor.execute(sql)
    allRarity = mycursor.fetchall()

# ************ Cards ************

def getCardById(id):
    sql = "SELECT * from card WHERE id_card = %s"
    val = (id,)
    mycursor.execute(sql, val)
    card = mycursor.fetchone()
    return card

def get_all_cards(id = None):
    
    if id is None:
        sql = "SELECT c.*, cat.nom_cat AS category FROM card c LEFT JOIN category cat ON c.id_cat = cat.id_cat"
        mycursor.execute(sql)
    else : 
        # Je récupère les cartes et si l'utilisateur a déjà obtenu la carte
        sql = "SELECT c.*, c_u.amount_card AS amount, c_u.id_user IS NOT NULL AS obtained " \
          "FROM card AS c LEFT JOIN cardPerUser AS c_u " \
          "ON c.id_card = c_u.id_card AND c_u.id_user = %s "
        val = (id,)
        mycursor.execute(sql, val)

    cards = mycursor.fetchall()
    return cards

def get_all_skills(id = None):
    
    if id is None:
        sql = "SELECT * FROM skill"
        mycursor.execute(sql)
    else : 
        # Je récupère les skills d'un outilisateur
        sql = "SELECT s.* FROM skill AS s JOIN skillPerCard AS s_c ON s.id_skill = s_c.id_skill AND s_c.id_card = %s"
        val = (id,)
        mycursor.execute(sql, val)

    cards = mycursor.fetchall()
    return cards

def get_all_rarities():
    sql = "SELECT * FROM rarity"
    mycursor.execute(sql)
    rarities = mycursor.fetchall()
    return rarities

def get_all_categories():
    sql = "SELECT * FROM category"
    mycursor.execute(sql)
    rarities = mycursor.fetchall()
    return rarities