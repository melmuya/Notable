import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import Navbar from '../components/Navbar'

const NoteDetail = () => {
  const { noteId } = useParams()
  const [note, setNote] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axiosInstance.get(`/notes/${noteId}`)
        setNote(res.data)
      } catch (err) {
        setError("Failed to load note")
      }
    }

    fetchNote()
  }, [noteId])

  if (error) return <p>{error}</p>
  if (!note) return <p>Loading...</p>

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <Link to={`/edit/${note.id}`}>
            <button>
                Edit
            </button>
        </Link> |{" "}
        <button onClick={async () => {
          try {
            await axiosInstance.delete(`/notes/${note.id}`)
            navigate("/dashboard")
          } catch (err) {
            alert("Failed to delete note")
          }
        }}>Delete</button>
      </div>
    </>
  )
}

export default NoteDetail
