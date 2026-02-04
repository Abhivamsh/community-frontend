import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPost } from '../api';

function CreatePostBox({ onPostCreated }) {
  const [quickPost, setQuickPost] = useState(false);
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
      setQuickPost(false);
      onPostCreated();
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (quickPost) {
    return (
      <div className="bg-white rounded-md border border-slate-200 p-4 mb-4 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Username"
            className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows="4"
            className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
            disabled={loading}
            autoFocus
          />
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuickPost(false)}
              className="px-4 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim() || !author.trim()}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border border-slate-200 p-2 mb-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Create Post"
          className="flex-1 bg-slate-100 border border-slate-300 rounded-md px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 cursor-pointer"
          onClick={() => setQuickPost(true)}
          readOnly
        />
        <Link
          to="/submit"
          className="p-2 text-slate-500 hover:bg-slate-100 rounded transition-colors"
          title="Create Post"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </Link>
        <Link
          to="/submit"
          className="p-2 text-slate-500 hover:bg-slate-100 rounded transition-colors"
          title="Create Link Post"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default CreatePostBox;
