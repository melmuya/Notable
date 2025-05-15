import React, { useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../api/axios'
import { Link } from 'react-router-dom'

const Dashboard = () => {

    const [notes, setNotes] = useState([])
    const [error, setError] = useState("")

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
        <Link to="/new-note">
            <button>
                Create New Note
            </button>
        </Link>
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Your notes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {notes.length === 0 && <p>No notes yet</p>}
            {notes.length === 1 && <p>you have 1 Note.</p>}
            {notes.length > 1 && <p>You have {notes.length} notes.</p>}
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {notes.map(note => (
                    <li key={note.id} style={{
                    listStyle: 'none',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                    <h3>
                        <Link to={`/note/${note.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                        {note.title}
                        </Link>
                    </h3>
                    <p>{note.content.length > 100 ? note.content.substring(0, 100) + '...' : note.content}</p>
                    </li>
                ))}
            </ul>

        </div>
    </>
  )
}

export default Dashboard