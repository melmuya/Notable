import pytest
from app import create_app
from extensions import db
from models import User, Note
from flask_jwt_extended import create_access_token

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'test-secret'

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def user():
    user = User(username="testuser")
    user.set_password("testpassword")
    db.session.add(user)
    db.session.commit()
    return user

def get_auth_header(app, user_id):
    with app.app_context():
        token = create_access_token(identity=user_id)
    return {'Authorization': f'Bearer {token}'}

def test_create_note(app, client, user):
    headers = get_auth_header(app, user.id)
    response = client.post('/api/notes/', json={
        'title': 'Test Note',
        'content': 'Test Content'
    }, headers=headers)

    assert response.status_code == 201
    assert response.json['title'] == 'Test Note'
    assert Note.query.count() == 1

def test_get_notes(app, client, user):
    note = Note(title="Note A", content="Hello", user_id=user.id)
    db.session.add(note)
    db.session.commit()

    headers = get_auth_header(app, user.id)
    response = client.get('/api/notes/', headers=headers)

    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['title'] == "Note A"

def test_update_note(app, client, user):
    note = Note(title="Old Title", content="Old", user_id=user.id)
    db.session.add(note)
    db.session.commit()

    headers = get_auth_header(app, user.id)
    response = client.put(f'/api/notes/{note.id}', json={
        'title': 'Updated Title'
    }, headers=headers)

    assert response.status_code == 200
    assert response.json['title'] == 'Updated Title'
    updated_note = Note.query.get(note.id)
    assert updated_note.title == 'Updated Title'

def test_delete_note(app, client, user):
    note = Note(title="Delete Me", content="Bye", user_id=user.id)
    db.session.add(note)
    db.session.commit()

    headers = get_auth_header(app, user.id)
    response = client.delete(f'/api/notes/{note.id}', headers=headers)

    assert response.status_code == 204
    assert Note.query.get(note.id) is None
