import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import Navbar from '../components/Navbar'
import QuillEditor from '../components/QuillEditor'
import './NewNote.css'

const NewNote = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!title.trim()) {
      setError("Title is required")
      setLoading(false)
      return
    }

    if (!content.trim() || content === '<p><br></p>') {
      setError("Content is required")
      setLoading(false)
      return
    }

    try {
      await axiosInstance.post("/notes/", { title: title.trim(), content })
      setSuccess("Note created successfully! Redirecting...")
      
      // Clear form and redirect
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
      
    } catch (err) {
      console.error("Failed to create note", err)
      setError(err.response?.data?.message || "Failed to create note. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/dashboard")
  }

  return (
    <>
      <Navbar />
      <div className="new-note-container">
        <div className="new-note-card">
          <div className="new-note-header">
            <h2>Create New Note</h2>
            <p className="new-note-subtitle">Start writing your thoughts and ideas</p>
          </div>
          
          <form className="new-note-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Note Title</label>
              <input
                type="text"
                id="title"
                className="form-input title-input"
                placeholder="Enter a descriptive title for your note"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Note Content</label>
              <div className="editor-wrapper">
                <QuillEditor
                  value={content}
                  onChange={(value) => setContent(value)}
                  placeholder="Start writing your note..."
                  outputFormat="html"
                  toolbar="standard"
                />
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="create-button"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default NewNote