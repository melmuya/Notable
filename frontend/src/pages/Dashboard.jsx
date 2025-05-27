import React, { useEffect, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import axiosInstance from '../api/axios'
import { Link } from 'react-router-dom'
import './Dashboard.css'
import Modal from '../components/Modal';
import SaveConfirmationModal from '../components/SaveConfirmationModal';
import QuillEditor from '../components/QuillEditor'

const Dashboard = () => {
    const [notes, setNotes] = useState([])
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [hasChanges, setHasChanges] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCancelEditModal, setShowCancelEditModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Track if edits have been made
    useEffect(() => {
        if (selectedNote && isEditing) {
            setHasChanges(
                editTitle !== selectedNote.title || 
                editContent !== selectedNote.content
            );
        }
    }, [editTitle, editContent, selectedNote, isEditing]);

    const handleUpdateNote = async (e) => {
        if (e) e.preventDefault();
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
            
            // Reset changes flag
            setHasChanges(false);
            
            // Close save modal if it was open
            setShowSaveModal(false);
            
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
        // Show the appropriate modal based on whether changes were made
        if (hasChanges) {
            setShowCancelEditModal(true);
        } else {
            confirmCancelEdit();
        }
    };

    const confirmCancelEdit = () => {
        setIsEditing(false);
        setShowCancelEditModal(false);
        setHasChanges(false);
    };

    const dismissCancelEdit = () => {
        setShowCancelEditModal(false);
    };

    // New save confirmation handlers
    const handleSaveClick = (e) => {
        e.preventDefault();
        if (hasChanges) {
            setShowSaveModal(true);
        } else {
            setIsEditing(false);
        }
    };

    const confirmSave = () => {
        handleUpdateNote();
    };

    const dismissSave = () => {
        setShowSaveModal(false);
    };

    // Function to force re-rendering of notes
    const forceUpdate = useCallback(() => {
        setNotes(prevNotes => [...prevNotes]);
    }, []);
    
    // Add escape key listener to cancel editing
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape' && isEditing) {
                if (hasChanges) {
                    setShowCancelEditModal(true);
                } else {
                    setIsEditing(false);
                }
            }
        };
        
        window.addEventListener('keydown', handleEscapeKey);
        
        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isEditing, hasChanges]);

    // Add navigation warning for unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isEditing && hasChanges) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isEditing, hasChanges]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axiosInstance.get("/notes/")
                setNotes(Array.isArray(response.data) ? response.data : [])
                setError("")
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError("You are not logged in. Please log in to view your notes.");
                    // Optionally, redirect to login page here
                    // navigate('/login');
                } else {
                    console.error("Failed to fetch notes", err)
                    setError("Failed to load notes")
                }
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

    // Function to format the date from the creation timestamp
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
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
                                Create Note
                            </Link>
                        </div>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="search-input"
                        />

                        {error && <p style={{ color: 'red', padding: '0 1.5rem' }}>{error}</p>}
                        
                        <p className="notes-info">
                            {notes.length === 0 && "No notes yet"}
                            {notes.length === 1 && "You have 1 note"}
                            {notes.length > 1 && `You have ${notes.length} notes`}
                        </p>

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
                                            if (isEditing && hasChanges) {
                                                setShowSaveModal(true);
                                                // Store note to switch to after handling save
                                                sessionStorage.setItem('pendingNoteId', note.id);
                                            } else {
                                                setSelectedNote({...note}); // Create new reference
                                                setIsEditing(false);
                                            }
                                        }}
                                    >
                                        <h3>{note.title}</h3>
                                        <p>{previewText}</p>
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
                            <form className="note-edit-form" onSubmit={handleSaveClick}>
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
                                        setEditContent(content);
                                    }}
                                    placeholder="Note content"
                                    outputFormat="html"
                                    toolbar="standard"
                                />
                                <div className="button-group">
                                    <button type='submit' className="edit-button">
                                        Save Changes
                                    </button>
                                    <button type='button' className="delete-button" onClick={cancelEdit}>
                                        Cancel
                                    </button>
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
                            message="Are you sure you want to delete this note? This action cannot be undone."
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                        />
                    </main>
                </div>

                {/* Cancel Edit Modal */}
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

                {/* Save Confirmation Modal */}
                <SaveConfirmationModal 
                    isOpen={showSaveModal}
                    onSave={confirmSave}
                    onDiscard={() => {
                        // Check if there's a pending note to switch to
                        const pendingNoteId = sessionStorage.getItem('pendingNoteId');
                        if (pendingNoteId) {
                            // Find the note in our list
                            const noteToSelect = notes.find(note => note.id === pendingNoteId);
                            if (noteToSelect) {
                                setSelectedNote({...noteToSelect});
                            }
                            // Clear storage
                            sessionStorage.removeItem('pendingNoteId');
                        }
                        // Reset editing state
                        setIsEditing(false);
                        setHasChanges(false);
                        setShowSaveModal(false);
                    }}
                />
            </div>
        </>
    )
}

export default Dashboard