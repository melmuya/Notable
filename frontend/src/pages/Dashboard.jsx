import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../api/axios'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const [notes, setNotes] = useState([])
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("");

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
            <li key={note.id} className="note-card">
              <h3>
                <Link to={`/note/${note.id}`}>{note.title}</Link>
              </h3>
              <p>
                {note.content.length > 100
                  ? note.content.substring(0, 100) + '...'
                  : note.content}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Dashboard
