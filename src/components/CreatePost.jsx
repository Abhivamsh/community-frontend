import React, { useState } from 'react';
import { createPost } from '../api';

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() || !author.trim()) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createPost({ content, author_name: author });
      setContent('');
      setAuthor('');
      onPostCreated();
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your username"
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What's on your mind?"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
