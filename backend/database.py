import mysql.connector

def init_db():
    db = get_db()
    cursor = db.cursor()
    
    # Create 'users' table if not exists with 'status' column
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255),
            role_id INT,
            status TEXT DEFAULT 'Active'
        )
    ''')


    # Create 'roles' table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255)
        )
    ''')

    # Create 'permissions' table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS permissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    ''')

    db.commit()

def get_db():
    return mysql.connector.connect(
        host="localhost",
        users="root",
        password="123456",
        database="rbac_db"
    )



