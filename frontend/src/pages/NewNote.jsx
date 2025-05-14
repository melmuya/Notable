import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import Navbar from '../components/Navbar'

const NewNote = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!title || !content) {
      setError("Title and content are required")
      return
    }

    try {
      await axiosInstance.post("/notes/", { title, content })
      setSuccess("Note created successfully")
      setTitle("")
      setContent("")
      // Optional: redirect after 1s delay
      setTimeout(() => navigate("/dashboard"), 1000)
    } catch (err) {
      console.error("Failed to create note", err)
      setError("Failed to create note")
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Create a new note</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }}
            required
          />
          <textarea
            placeholder="Note content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ display: 'block', width: '100%', height: '100px', marginBottom: '0.5rem' }}
            required
          />
          <button type="submit">Add Note</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </>
  )
}

export default NewNote
