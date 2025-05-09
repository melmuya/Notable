from flask import Flask, jsonify

from flask_cors import CORS
import os
from flask_migrate import Migrate

from extensions import db, jwt

from datetime import timedelta

def create_app():
    app = Flask(__name__)

    # Basic configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'super-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    app.config['JWT_ACCESSS_TOKEN_EXPIRES'] = timedelta(hours=3)
    app.config['DEBUG'] = True

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    migrate = Migrate(app, db)

    with app.app_context():

        # Import models here to avoid circular imports (after db is initialized)
        from models import User, Note

        # Create the database tables if they don't exist
        db.create_all()

        # Import and register blueprints (to be created later)
    from routes.auth import auth_bp
    from routes.notes import notes_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(notes_bp, url_prefix='/api/notes')

    return app

# Run the app
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
