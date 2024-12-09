# models.py (or your equivalent file for database models)
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Permission model to store permissions
class Permission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

# Many-to-many relationship table between roles and permissions
role_permissions = db.Table('role_permissions',
    db.Column('role_id', db.Integer, db.ForeignKey('role.id')),
    db.Column('permission_id', db.Integer, db.ForeignKey('permission.id'))
)

# Role model to store roles and their associated permissions
class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    permissions = db.relationship('Permission', secondary=role_permissions, backref='roles')
