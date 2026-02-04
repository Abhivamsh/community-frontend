import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPost } from '../api';

function CreatePostPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('post');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() || !author.trim()) {
      setError('Username and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postContent = title ? `${title}\n\n${content}` : content;
      await createPost({ content: postContent, author_name: author });
      navigate('/');
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-medium text-slate-800">Create a post</h1>
        <Link 
          to="/" 
          className="text-slate-500 hover:text-slate-700 text-sm"
        >
          Cancel
        </Link>
      </div>

      {/* Community Selector */}
      <div className="bg-white border border-slate-200 rounded-md p-3 mb-4 flex items-center gap-3 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-800">r/community</div>
          <div className="text-xs text-slate-500">Community Feed</div>
        </div>
      </div>

      {/* Post Form */}
      <div className="bg-white border border-slate-200 rounded-md shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('post')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'post'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Post
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'image'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Image & Video
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'link'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Link
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Username */}
          <div className="mb-3">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Username"
              className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
          </div>

          {/* Title (optional) */}
          <div className="mb-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              maxLength={300}
              className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
            <div className="text-xs text-slate-400 mt-1 text-right">
              {title.length}/300
            </div>
          </div>

          {/* Content */}
          <div className="mb-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Text (required)"
              rows="8"
              className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-3 p-2 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <Link
              to="/"
              className="px-4 py-1.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-full hover:border-blue-500 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !content.trim() || !author.trim()}
              className="px-4 py-1.5 text-sm font-medium bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-4 bg-white border border-slate-200 rounded-md p-4 shadow-sm">
        <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Posting Tips
        </h3>
        <ul className="text-xs text-slate-500 space-y-1">
          <li>• Be respectful and kind to others</li>
          <li>• Use descriptive titles for better engagement</li>
          <li>• Add relevant details in your post</li>
        </ul>
      </div>
    </div>
  );
}

export default CreatePostPage;
