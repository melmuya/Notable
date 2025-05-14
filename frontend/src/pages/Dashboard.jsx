import React, { useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../api/axios'
import { Link } from 'react-router-dom'

const Dashboard = () => {

    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
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
        <div style={{ padding: '2rem' }}>
            <h2>Your notes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {notes.length === 0 && <p>No notes yet</p>}
            {notes.length === 1 && <p>you have 1 Note.</p>}
            {notes.length > 1 && <p>You have {notes.length} notes.</p>}
            <ul>
            {notes.map(note => (
                <li key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                </li>
            ))}
            </ul> 
        </div>
    </>
  )
}

export default Dashboard