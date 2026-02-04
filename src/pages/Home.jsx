import React, { useState, useEffect } from 'react';
import { fetchPosts, fetchLeaderboard } from '../api';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import CreatePostBox from '../components/CreatePostBox';

function Home() {
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('hot');

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsRes, leaderboardRes] = await Promise.all([
        fetchPosts(),
        fetchLeaderboard()
      ]);
      setPosts(postsRes.data);
      setLeaderboard(leaderboardRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePostCreated = () => {
    loadData();
  };

  const handleVoteUpdate = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-slate-500">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Create Post Box */}
          <CreatePostBox onPostCreated={handlePostCreated} />

          {/* Sort Tabs */}
          <div className="bg-white rounded-md mb-4 border border-slate-200 shadow-sm">
            <div className="flex items-center p-2 gap-2">
              <button
                onClick={() => setSortBy('hot')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  sortBy === 'hot'
                    ? 'bg-slate-100 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Hot
              </button>
              <button
                onClick={() => setSortBy('new')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  sortBy === 'new'
                    ? 'bg-slate-100 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                New
              </button>
              <button
                onClick={() => setSortBy('top')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  sortBy === 'top'
                    ? 'bg-slate-100 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Top
              </button>
            </div>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-md p-8 text-center border border-slate-200 shadow-sm">
              <div className="text-slate-500 mb-2">No posts yet</div>
              <div className="text-slate-400 text-sm">Be the first to create a post!</div>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map(post => (
                <PostCard key={post.id} post={post} onVoteUpdate={handleVoteUpdate} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar leaderboard={leaderboard} />
        </div>
      </div>
    </div>
  );
}

export default Home;
