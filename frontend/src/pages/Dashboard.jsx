import React, { useEffect, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../api/axios'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import Modal from '../components/Modal';
import QuillEditor from '../components/QuillEditor'


const Dashboard = () => {
    const [notes, setNotes] = useState([])
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCancelEditModal, setShowCancelEditModal] = useState(false);


    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpdateNote = async (e) => {
        e.preventDefault();
        try {
            // Create the updated note object
            const updatedNote = {
                title: editTitle,
                content: editContent,
            };

            // Make the API call
            const response = await axiosInstance.put(`/notes/${selectedNote.id}`, updatedNote);
            
            // Create a local updated note object with our form values to ensure consistency
            const updatedNoteData = {
                ...selectedNote, // Keep other properties like id
                title: editTitle,
                content: editContent
            };

            console.log("Note updated with content:", updatedNoteData.content);
            
            // Force React to see this as a new array by creating a completely new reference
            const updatedNotes = [...notes].map(note => {
                if (note.id === selectedNote.id) {
                    // Create a brand new object to break reference equality
                    return JSON.parse(JSON.stringify(updatedNoteData));
                }
                return note;
            });
            
            // Exit edit mode first to avoid any state update conflicts
            setIsEditing(false);
            
            // Update selected note with a new object reference
            setSelectedNote({...updatedNoteData});
            
            // Then update the whole notes array
            setNotes(updatedNotes);
            
            // Force re-render after a short delay
            setTimeout(() => {
                console.log("Forcing re-render");
                setNotes([...updatedNotes]);
            }, 50);
            
        } catch (error) {
            alert("Failed to update the note.");
            console.error(error);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/notes/${selectedNote.id}`);
            setNotes(notes.filter(note => note.id !== selectedNote.id));
            setSelectedNote(null);
            setShowDeleteModal(false);
        } catch (err) {
            alert("Failed to delete note");
        }
    };

    const cancelEdit = () => {
        setShowCancelEditModal(true);
    };

    const confirmCancelEdit = () => {
        setIsEditing(false);
        setShowCancelEditModal(false);
    };

    const dismissCancelEdit = () => {
        setShowCancelEditModal(false);
    };


    // Function to force re-rendering of notes
    const forceUpdate = useCallback(() => {
        setNotes(prevNotes => [...prevNotes]);
    }, []);
    
    // Add escape key listener to cancel editing
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isEditing) {
                setShowCancelEditModal(true);
            }
        };
        
        window.addEventListener('keydown', handleEscapeKey);
        
        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isEditing]);

    // Add some basic styling for selected note
    useEffect(() => {
        // Add CSS for selected note if not already present
        const styleId = 'note-selection-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .note-card.selected {
                    background-color: #e9f5ff;
                    border-left: 3px solid #0078d4;
                }
                
                /* For debugging - add a red border to help see content updates */
                .debug-border {
                    border: 1px solid red;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

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

    // Function to safely render HTML content
    const renderHtmlContent = (htmlContent) => {
        return { __html: htmlContent || '' };
    };
    
    // Helper function to strip HTML tags from content
    const stripHtmlTags = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '');
    };

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
                            {filteredNotes.map((note) => {
                                // Strip HTML tags for display in sidebar
                                const plainTextContent = stripHtmlTags(note.content);
                                const previewText = plainTextContent.length > 100 
                                    ? plainTextContent.substring(0, 100) + '...' 
                                    : plainTextContent;
                                
                                return (
                                    <li 
                                        key={note.id} 
                                        className={`note-card ${selectedNote && selectedNote.id === note.id ? 'selected' : ''}`}
                                        onClick={() => {
                                            console.log("Selected note content:", note.content);
                                            setSelectedNote({...note}); // Create new reference
                                            setIsEditing(false);
                                        }}
                                    >
                                        <h3>
                                            {note.title}
                                        </h3>
                                        <p>
                                            {previewText}
                                        </p>
                                    </li>
                                );
                            })}
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
                            <form className="note-edit-form" onSubmit={handleUpdateNote}>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Note title"
                                    required
                                    autoFocus
                                />
                                <QuillEditor
                                    value={editContent || ""}
                                    onChange={(content) => {
                                        console.log("Content changed to:", content);
                                        setEditContent(content);
                                    }}
                                    placeholder="Note content"
                                    outputFormat="html"
                                    toolbar="standard"
                                />
                                <div className="button-group">
                                    <button type='submit'>
                                        Save
                                    </button>
                                    <button type='button' onClick={cancelEdit}>Cancel</button>
                                </div>
                            </form>
                        )}

                        {selectedNote && !isEditing && (
                            <div className="note-detail">
                                <h2>{selectedNote.title}</h2>
                                <div 
                                    dangerouslySetInnerHTML={renderHtmlContent(selectedNote.content)} 
                                    className="note-content"
                                />
                                <div className="button-group">
                                    <button
                                        className="edit-button"
                                        onClick={() => {
                                            // Ensure we have the latest content before editing
                                            setEditTitle(selectedNote.title);
                                            setEditContent(selectedNote.content);
                                            setIsEditing(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button className="delete-button" onClick={handleDeleteClick}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                        <Modal
                            isOpen={showDeleteModal}
                            title="Delete Note"
                            message="Are you sure you want to delete this note? This action cannot be undone"
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                        />
                    </main>
                    {showCancelEditModal && (
                        <div className="modal-backdrop">
                            <div className="modal">
                                <p>Discard your changes?</p>
                                <div className="modal-buttons">
                                    <button onClick={confirmCancelEdit}>Yes, discard</button>
                                    <button onClick={dismissCancelEdit}>No, keep editing</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>


            </div>
        </>
    )
}

export default Dashboard