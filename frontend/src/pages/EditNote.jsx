// src/pages/EditNote.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import Navbar from '../components/Navbar'

const EditNote = () => {
  const { noteId } = useParams()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axiosInstance.get(`/notes/${noteId}`)
        setTitle(res.data.title)
        setContent(res.data.content)
      } catch (err) {
        setError("Failed to load note")
      }
    }

    fetchNote()
  }, [noteId])

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.put(`/notes/${noteId}`, { title, content })
      navigate(`/note/${noteId}`)
    } catch (err) {
      setError("Failed to update note")
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Edit Note</h2>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ display: 'block', width: '100%', height: '120px', marginBottom: '1rem' }}
          />
          <button type="submit">Save Changes</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </>
  )
}

export default EditNote
// This code defines a component for editing a note. It fetches the note data using the note ID from the URL parameters, allows the user to edit the title and content, and then updates the note when the form is submitted. If there's an error during fetching or updating, it displays an error message.