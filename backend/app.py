from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, Permission, Role  # Import Permission here
from flask_migrate import Migrate


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rbac_db.db'  # Use the same database URI across files
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)  # If your frontend runs on port 3000
# CORS(app, origins=["http://localhost:5173"])  # This allows your React app to communicate with Flask
migrate = Migrate(app, db)


# Define the many-to-many relationship table
roles_permissions = db.Table('roles_permissions',
    db.Column('role_id', db.Integer, db.ForeignKey('role.id')),
    db.Column('permission_id', db.Integer, db.ForeignKey('permission.id'))
)



# Define User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    status = db.Column(db.String(50), default='Active')  # Add this line


# Define Permission Model
class Permission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

# Define Role Model with relationship to Permission
class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    permissions = db.relationship('Permission', secondary=roles_permissions, backref=db.backref('roles', lazy='dynamic'))

# Add new permission (API endpoint)
@app.route('/api/permissions', methods=['POST'])
def add_permission():
    try:
        data = request.get_json()
        
        if not data or 'name' not in data:
            return jsonify({'error': 'Permission name is required'}), 400
        
        # Create new permission and save it
        new_permission = Permission(name=data['name'])
        db.session.add(new_permission)
        db.session.commit()

        return jsonify({
            'id': new_permission.id,
            'name': new_permission.name
        }), 201
    except Exception as e:
        # Log any errors
        print(f"Error adding permission: {e}")
        return jsonify({'error': 'Failed to add permission'}), 500


# Fetch all permissions (API endpoint)
@app.route('/api/permissions', methods=['GET'])
def get_permissions():
    permissions = Permission.query.all()
    return jsonify([{'id': permission.id, 'name': permission.name} for permission in permissions])

# Add new role (API endpoint)
@app.route('/api/roles', methods=['POST'])
def add_role():
    data = request.get_json()
    new_role = Role(name=data['name'])
    permissions = Permission.query.filter(Permission.id.in_(data['permissions'])).all()
    new_role.permissions.extend(permissions)
    db.session.add(new_role)
    db.session.commit()
    return jsonify({
        'id': new_role.id,
        'name': new_role.name,
        'permissions': [{'id': perm.id, 'name': perm.name} for perm in new_role.permissions]
    }), 201

# Update existing role (API endpoint)
# @app.route('/api/roles/<int:id>', methods=['PUT'])
# def update_role(id):
#     data = request.get_json()
#     role = Role.query.get(id)
#     if not role:
#         return jsonify({'error': 'Role not found'}), 404
#     role.name = data['name']
#     if 'permissions' in data:
#         role.permissions = Padd_userermission.query.filter(Permission.id.in_(data['permissions'])).all()
#     db.session.commit()
#     return jsonify({'message': 'Role updated successfully'})
# Update existing role (API endpoint)

@app.route('/api/roles/<int:id>', methods=['PUT'])
def update_role(id):
    data = request.get_json()
    role = Role.query.get(id)
    if not role:
        return jsonify({'error': 'Role not found'}), 404
    role.name = data['name']
    if 'permissions' in data:
        role.permissions = Permission.query.filter(Permission.id.in_(data['permissions'])).all()
    db.session.commit()
    return jsonify({'message': 'Role updated successfully'})



# Delete role (API endpoint)
@app.route('/api/roles/<int:id>', methods=['DELETE'])
def delete_role(id):
    role = Role.query.get(id)
    if not role:
        return jsonify({'error': 'Role not found'}), 404
    db.session.delete(role)
    db.session.commit()
    return jsonify({'message': 'Role deleted successfully'})

# Fetch all roles (API endpoint)
@app.route('/api/roles', methods=['GET'])
def get_roles():
    roles = Role.query.all()
    return jsonify([{
        'id': role.id,
        'name': role.name,
        'permissions': [{'id': perm.id, 'name': perm.name} for perm in role.permissions]
    } for role in roles])


# Add new users (API endpoint)
@app.route('/api/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()

        # Validate the input
        if not data or not all(key in data for key in ['name', 'email', 'role_id']):
            return jsonify({'error': 'Missing required fields: name, email, or role_id'}), 400

        # Set default status to 'Active' if not provided
        status = data.get('status', 'Active')

        new_user = User(
            name=data['name'],
            email=data['email'],
            role_id=data['role_id'],
            status=status 
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email,
            'role_id': new_user.role_id,
            'status': new_user.status  # Return status in the response
        }), 201

    except Exception as e:
        # Log the error to the console for debugging
        print(f"Error adding users: {e}")
        return jsonify({'error': 'Failed to add users'}), 500


# Update users (API endpoint)
@app.route('/api/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    users = User.query.get(id)
    if not users:
        return jsonify({'error': 'User not found'}), 404
    users.name = data['name']
    users.email = data['email']
    users.role_id = data['role_id']
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

# Delete users (API endpoint)
@app.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    users = User.query.get(id)
    if not users:
        return jsonify({'error': 'User not found'}), 404
    db.session.delete(users)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

# Get all users (API endpoint)
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()  # Retrieve all users from the database
    user_list = [{
        'id': users.id,
        'name': users.name,
        'email': users.email,
        'role_id': users.role_id,
        'status': users.status
    } for users in users]
    return jsonify(user_list)




if __name__ == '__main__':
    # init_db()  # Initialize database tables
    with app.app_context():
        db.create_all()  # Create all tables if they don't exist
    app.run(debug=True)




# from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# from models import db, Permission, Role  # Import Permission here
# from flask_migrate import Migrate


# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rbac_db.db'  # Use the same database URI across files
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)
# CORS(app)  # If your frontend runs on port 3000
# # CORS(app, origins=["http://localhost:5173"])  # This allows your React app to communicate with Flask
# migrate = Migrate(app, db)


# # Define the many-to-many relationship table
# roles_permissions = db.Table('roles_permissions',
#     db.Column('role_id', db.Integer, db.ForeignKey('role.id')),
#     db.Column('permission_id', db.Integer, db.ForeignKey('permission.id'))
# )



# # Define User Model
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     email = db.Column(db.String(100), unique=True, nullable=False)
#     role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)

# # Define Permission Model
# class Permission(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)

# # Define Role Model with relationship to Permission
# class Role(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     permissions = db.relationship('Permission', secondary=roles_permissions, backref=db.backref('roles', lazy='dynamic'))

# # Add new permission (API endpoint)
# @app.route('/api/permissions', methods=['POST'])
# def add_permission():
#     try:
#         data = request.get_json()
        
#         if not data or 'name' not in data:
#             return jsonify({'error': 'Permission name is required'}), 400
        
#         # Create new permission and save it
#         new_permission = Permission(name=data['name'])
#         db.session.add(new_permission)
#         db.session.commit()

#         return jsonify({
#             'id': new_permission.id,
#             'name': new_permission.name
#         }), 201
#     except Exception as e:
#         # Log any errors
#         print(f"Error adding permission: {e}")
#         return jsonify({'error': 'Failed to add permission'}), 500


# # Fetch all permissions (API endpoint)
# @app.route('/api/permissions', methods=['GET'])
# def get_permissions():
#     permissions = Permission.query.all()
#     return jsonify([{'id': permission.id, 'name': permission.name} for permission in permissions])

# # Add new role (API endpoint)
# @app.route('/api/roles', methods=['POST'])
# def add_role():
#     data = request.get_json()
#     new_role = Role(name=data['name'])
#     permissions = Permission.query.filter(Permission.id.in_(data['permissions'])).all()
#     new_role.permissions.extend(permissions)
#     db.session.add(new_role)
#     db.session.commit()
#     return jsonify({
#         'id': new_role.id,
#         'name': new_role.name,
#         'permissions': [{'id': perm.id, 'name': perm.name} for perm in new_role.permissions]
#     }), 201

# # Update existing role (API endpoint)
# @app.route('/api/roles/<int:id>', methods=['PUT'])
# def update_role(id):
#     data = request.get_json()
#     role = Role.query.get(id)
#     if not role:
#         return jsonify({'error': 'Role not found'}), 404
#     role.name = data['name']
#     if 'permissions' in data:
#         role.permissions = Padd_userermission.query.filter(Permission.id.in_(data['permissions'])).all()
#     db.session.commit()
#     return jsonify({'message': 'Role updated successfully'})

# # Delete role (API endpoint)
# @app.route('/api/roles/<int:id>', methods=['DELETE'])
# def delete_role(id):
#     role = Role.query.get(id)
#     if not role:
#         return jsonify({'error': 'Role not found'}), 404
#     db.session.delete(role)
#     db.session.commit()
#     return jsonify({'message': 'Role deleted successfully'})

# # Fetch all roles (API endpoint)
# @app.route('/api/roles', methods=['GET'])
# def get_roles():
#     roles = Role.query.all()
#     return jsonify([{
#         'id': role.id,
#         'name': role.name,
#         'permissions': [{'id': perm.id, 'name': perm.name} for perm in role.permissions]
#     } for role in roles])

# # Add new users (API endpoint)
# @app.route('/api/users', methods=['POST'])
# def add_user():
#     data = request.get_json()
#     new_user = User(name=data['name'], email=data['email'], role_id=data['role_id'])
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({
#         'id': new_user.id,
#         'name': new_user.name,
#         'email': new_user.email,
#         'role_id': new_user.role_id
#     }), 201

# # Update users (API endpoint)
# @app.route('/api/users/<int:id>', methods=['PUT'])
# def update_user(id):
#     data = request.get_json()
#     users = User.query.get(id)
#     if not users:
#         return jsonify({'error': 'User not found'}), 404
#     users.name = data['name']
#     users.email = data['email']
#     users.role_id = data['role_id']
#     db.session.commit()
#     return jsonify({'message': 'User updated successfully'})

# # Delete users (API endpoint)
# @app.route('/api/users/<int:id>', methods=['DELETE'])
# def delete_user(id):
#     users = User.query.get(id)
#     if not users:
#         return jsonify({'error': 'User not found'}), 404
#     db.session.delete(users)
#     db.session.commit()
#     return jsonify({'message': 'User deleted successfully'})




# if __name__ == '__main__':
#     # init_db()  # Initialize database tables
#     with app.app_context():
#         db.create_all()  # Create all tables if they don't exist
#     app.run(debug=True)
