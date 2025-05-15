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
                        {selectedNote ? (
                            <div className="note-detail">
                                <h2>{selectedNote.title}</h2>
                                <p>{selectedNote.content}</p>
                                <Link to={`/edit/${selectedNote.id}`}>
                                    <button className="edit-button">Edit</button>
                                </Link>
                                <button
                                    className="delete-button"
                                    onClick={async () => {
                                        try {
                                            await axiosInstance.delete(`/notes/${selectedNote.id}`)
                                            setNotes(notes.filter(note => note.id !== selectedNote.id))
                                            setSelectedNote(null)
                                        } catch (err) {
                                            alert("Failed to delete note")
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h2>Welcome to Notable!</h2>
                                <p>Select a note to view its details or create a new one.</p>
                            </div>
                        )}

                        
                    </main>
                </div>


            </div>
        </>
    )
}

export default Dashboard
