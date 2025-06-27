from datetime import datetime, timedelta
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
# **************** CHECK EXISTING *****************
# *************************************************

def checkPassword(id, password):
    sql = "SELECT * FROM user WHERE id_user = %s AND mdp_user = %s"
    val = (id, password)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()
    return result is not None

def checkUser(id):
    sql = "SELECT id_user FROM user WHERE id_user = %s"
    val = (id,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()
    return result is not None # true is user founded, else false

def checkCardExists(id):
    sql = "SELECT id_card FROM card WHERE id_card = %s"
    val = (id,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()
    return result is not None  # true if card exists, else false

# def checkUserCanOpenBooster(id):
#     sql = "SELECT last_booster FROM user WHERE id_user = %s"
#     val = (id,)
#     mycursor.execute(sql, val)
#     result = mycursor.fetchone()

#     now = datetime.now()
#     last_booster_dt = datetime.combine(now.date(), result)

#     if now - last_booster_dt < timedelta(minutes=5):
#         return False
#     return True

# *************************************************
# ********************** GET **********************
# *************************************************

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

def getCardById(id):
    sql = "SELECT * from card WHERE id_card = %s"
    val = (id,)
    mycursor.execute(sql, val)
    card = mycursor.fetchone()
    return card

def getSkillById(id):
    sql = "SELECT * from skill WHERE id_skill = %s"
    val = (id,)
    mycursor.execute(sql, val)
    skill = mycursor.fetchone()
    return skill

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

    skills = mycursor.fetchall()

    return skills

def get_skills_assigned_card(id):
    # Je récupère les skills d'un outilisateur
    sql = "SELECT s.*, (s_c.id_card IS NOT NULL) AS assigned FROM skill AS s LEFT JOIN skillPercard AS s_c ON s.id_skill = s_c.id_skill AND s_c.id_card = %s"
    val = (id,)
    mycursor.execute(sql, val)

    skills = mycursor.fetchall()

    return skills

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

def getlastBoosterOpening(user_id):
    sql = "SELECT last_booster FROM user WHERE id_user = %s"
    val = (user_id,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()
    return result

def getCardsByRarity(id_rarity):
    sql = "SELECT * FROM card WHERE id_rarity = %s"
    val = (id_rarity,)
    mycursor.execute(sql, val)
    result = mycursor.fetchall()
    return result

def getUserLastBooster(id_user):
    sql = "SELECT last_booster FROM user WHERE id_user = %s"
    val = (id_user,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()

# *************************************************
# ******************** CREATE *********************
# *************************************************

def createUser(id, username, password):
    sql = "INSERT INTO user (id_user, pseudo_user, mdp_user) VALUES (%s, %s, %s)"
    val = (id, username, password)
    mycursor.execute(sql, val)
    mydb.commit()

def createCard(name, pv, img, cat, rar, skill_ids):
    # Créationd e la carte
    sql = "INSERT INTO card (name_card, pv_card, image_card, id_cat, id_rarity, date_release) VALUES (%s, %s, %s, %s, %s, NOW())"
    val = (name, pv, img, cat, rar)
    mycursor.execute(sql, val)
    mydb.commit()

    last_id = mycursor.lastrowid

    # Insertion des nouvelles compétences
    for skill_id in skill_ids:
        sql = "INSERT INTO skillPercard (id_card, id_skill) VALUES (%s, %s)"
        val = (last_id, int(skill_id))
        mycursor.execute(sql, val)

    mydb.commit()

    sql = "SELECT c.*, cat.nom_cat AS category FROM card c LEFT JOIN category cat ON c.id_cat = cat.id_cat WHERE c.id_card = %s"
    val = (last_id,)
    mycursor.execute(sql, val)
    added_card = mycursor.fetchone()



    return added_card

def createSkill(name, desc, pow, cost):
    sql = "INSERT INTO skill (name_skill, desc_skill, power_skill, e_cost_skill) VALUES (%s, %s, %s, %s)"
    val = (name, desc, pow, cost)
    mycursor.execute(sql, val)
    mydb.commit()

    last_id = mycursor.lastrowid

    added_skill = getSkillById(last_id)

    return added_skill

def addCardToUser(user_id, card_id):
    # Vérifie si user possède déjà la carte
    sql = "SELECT amount_card FROM cardPerUser WHERE id_user = %s AND id_card = %s"
    mycursor.execute(sql, (user_id, card_id))
    result = mycursor.fetchone()

    if result:
        print("J'incrémente")
        # incrémenter amount
        sql = "UPDATE cardPerUser SET amount_card = amount_card + 1 WHERE id_user = %s AND id_card = %s"
        val = (user_id, card_id)
        mycursor.execute(sql, val)
    else:
        print("J'ajoute")
        # insérer nouvelle ligne
        sql = "INSERT INTO cardPerUser (id_user, id_card, amount_card) VALUES (%s, %s, 1)"
        val = (user_id, card_id)
        mycursor.execute(sql, val)

    mydb.commit()



# *************************************************
# ******************** UPDATE *********************
# *************************************************

def updateCard(id, name, pv, img, cat, rar, skill_ids):

    # Update de la card 
    sql = "UPDATE card SET name_card = %s, pv_card = %s, image_card = %s, id_cat = %s , id_rarity = %s WHERE id_card = %s"
    val = (name, pv, img, cat, rar, id)
    mycursor.execute(sql, val)

    # Delete de tous les skills associés à cette card
    sql = "DELETE FROM skillPercard WHERE id_card = %s"
    val = (id,)
    mycursor.execute(sql, val)

    # Insertion des nouvelles compétences
    for skill_id in skill_ids:
        sql = "INSERT INTO skillPercard (id_card, id_skill) VALUES (%s, %s)"
        val = (id, int(skill_id))
        mycursor.execute(sql, val)

    mydb.commit()

def updateSkill(id, name, desc, pow, cost):
    sql = "UPDATE skill SET name_skill = %s, desc_skill = %s, power_skill = %s, e_cost_skill = %s WHERE id_skill = %s"
    val = (name, desc, pow, cost, id)
    mycursor.execute(sql, val)
    mydb.commit()

def setLastBoosterTime(user_id):
    now = datetime.now().time()
    sql = "UPDATE user SET last_booster = %s WHERE id_user = %s"
    val = (now, user_id)
    mycursor.execute(sql, val)

# *************************************************
# ******************** DELETE *********************
# *************************************************

def deleteCard(id):
    # Les delete on cascade sont activés
    sql = "DELETE FROM card WHERE id_card = %s"
    val = (id,)
    mycursor.execute(sql, val)
    mydb.commit()

def deleteSkill(id):
    # Les delete on cascade sont activés
    sql = "DELETE FROM skill WHERE id_skill = %s"
    val = (id,)
    mycursor.execute(sql, val)
    mydb.commit()

def deleteUser(id):
    # Les delete on cascade sont activés
    sql = "DELETE FROM user WHERE id_user = %s"
    val = (id,)
    mycursor.execute(sql, val)
    mydb.commit()