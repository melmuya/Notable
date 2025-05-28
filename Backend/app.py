from flask import Flask, jsonify

from flask_cors import CORS
import os
from flask_migrate import Migrate

from extensions import db, jwt

from datetime import timedelta

from dotenv import load_dotenv
load_dotenv()

def create_app():
    app = Flask(__name__)

    # Basic configuration
    # app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') 
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') 
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    
    # app.config['DEBUG'] = True

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({'error': 'Missing or invalid token'}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token expired'}), 401


    # Improved CORS configuration
    CORS(
        app,
        origins=["https://notable-phi.vercel.app", "http://localhost:5173"],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
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

# Create app instance for Gunicorn
app = create_app()

# Run the app
if __name__ == '__main__':
    app.run(debug=True)