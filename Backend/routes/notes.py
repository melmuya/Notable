from flask import Blueprint, jsonify, request
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Note, User

notes_bp = Blueprint('notes', __name__, url_prefix='/api/notes')

# Temporary in-memory storage (just for testing)

# Create a note (CREATE)
@notes_bp.route('/', methods=['POST'])
@jwt_required()
def create_note():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({'error': 'Missing title or content'}), 400

    new_note = Note(
        title=data.get("title"),
        content=data.get("content"),
        user_id=user_id
    )

    db.session.add(new_note)
    db.session.commit()

    return jsonify(new_note.to_dict()), 201

# Get all notes for a user (READ)
@notes_bp.route('/', methods=['GET'])
@jwt_required()
def get_notes():

    user_id = get_jwt_identity()
    notes = Note.query.filter_by(user_id=user_id).all()
    return jsonify([note.to_dict() for note in notes])

# Get a single note for a user (READ)
@notes_bp.route('/<int:note_id>', methods=['GET'])
@jwt_required()
def get_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()

    if not note:
        return jsonify({'error': 'Note not found'}), 404

    return jsonify(note.to_dict())

# Update a note (UPDATE)
@notes_bp.route('/<int:note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()

    if not note:
        return jsonify({'error': 'Note not found'}), 404

    note.title = data.get('title', note.title)
    note.content = data.get('content', note.content)

    db.session.commit()

    return jsonify(note.to_dict())

# Delete a note (DELETE)
@notes_bp.route('/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()

    if not note:
        return jsonify({'error': 'Note not found'}), 404

    db.session.delete(note)
    db.session.commit()

    return jsonify({'message': 'Note deleted successfully'}), 200