import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../api/axios'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
    const [notes, setNotes] = useState([])
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");


    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );


    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axiosInstance.get("/notes/")
                setNotes(response.data)
            } catch (err) {
                console.error("Failed to fetch notes", err)
                setError("Failed to load notes")
            }
        }

        fetchNotes()
    }, [])

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className='main-layout'>
                    <aside className="sidebar">
                        <div className="header-section">
                            <h2>Your Notes</h2>
                            <Link to="/new-note" className="create-note-button">
                                + Create Note
                            </Link>
                        </div>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="search-input"
                        />

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {notes.length === 0 && <p className="notes-info">No notes yet</p>}
                        {notes.length === 1 && <p className="notes-info">You have 1 note.</p>}
                        {notes.length > 1 && (
                            <p className="notes-info">You have {notes.length} notes.</p>
                        )}

                        <ul className="notes-list">
                            {filteredNotes.map((note) => (
                                <li key={note.id} className="note-card" onClick={() => setSelectedNote(note)}>
                                    <h3>
                                        {note.title}
                                    </h3>
                                    <p>
                                        {note.content.length > 100
                                            ? note.content.substring(0, 100) + '...'
                                            : note.content}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    <main className="main-content">
                        {!selectedNote && (
                            <div>
                                <h2>Welcome to Notable!</h2>
                                <p>Select a note to view its details or create a new one.</p>
                            </div>
                        )}

                        {selectedNote && isEditing && (
                            <div className="note-edit-form">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Note title"
                                />
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder="Note content"
                                />
                                <div className="button-group">
                                    <button
                                        onClick={async () => {
                                            try {
                                                const updated = {
                                                    title: editTitle,
                                                    content: editContent
                                                };

                                                await axiosInstance.put(`/notes/${selectedNote.id}`, updated);

                                                const updatedNotes = notes.map(note =>
                                                    note.id === selectedNote.id ? { ...note, ...updated } : note
                                                );

                                                setNotes(updatedNotes);
                                                setSelectedNote({ ...selectedNote, ...updated });
                                                setIsEditing(false);
                                            } catch (err) {
                                                alert("Failed to update note");
                                            }
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        )}

                        {selectedNote && !isEditing && (
                            <div className="note-detail">
                                <h2>{selectedNote.title}</h2>
                                <p>{selectedNote.content}</p>
                                <div className="button-group">
                                    <button
                                        className="edit-button"
                                        onClick={() => {
                                            setEditTitle(selectedNote.title);
                                            setEditContent(selectedNote.content);
                                            setIsEditing(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={async () => {
                                            try {
                                                await axiosInstance.delete(`/notes/${selectedNote.id}`);
                                                setNotes(notes.filter(note => note.id !== selectedNote.id));
                                                setSelectedNote(null);
                                            } catch (err) {
                                                alert("Failed to delete note");
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>

                </div>


            </div>
        </>
    )
}

export default Dashboard
