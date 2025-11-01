import React, { useState } from 'react';
import axios from 'axios';

// We'll pass the token and a function to refresh data
const NewEntryForm = ({ token, onEntryAdded }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim() === '') {
            setError('Entry cannot be empty.');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            await axios.post(
                `${API_URL}/api/entries/`,
                { content: content },
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            );

            // It worked!
            setContent(''); // Clear the textarea
            setSubmitting(false);

            // Tell the dashboard to refresh its data
            if(onEntryAdded) {
                onEntryAdded();
            }

        } catch (err) {
            setError('Failed to submit entry.');
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="new-entry-form card">
            <h3>Write a New Entry</h3>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows="5"
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Entry'}
            </button>
        </form>
    );
};

export default NewEntryForm;