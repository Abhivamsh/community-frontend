import React, { useState } from 'react';

function LikeButton({ score, onLike, size = 'sm' }) {
  const [liking, setLiking] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [liked, setLiked] = useState(false);

  const handleLikeClick = async () => {
    // Check localStorage for saved username
    const savedName = localStorage.getItem('playto_username');
    
    if (savedName) {
      // Use saved username
      setLiking(true);
      try {
        await onLike(savedName);
        setLiked(true);
      } catch (err) {
        console.error('Like failed:', err);
      } finally {
        setLiking(false);
      }
    } else if (!userName.trim()) {
      // Show input to get username
      setShowInput(true);
    } else {
      // Save and use entered username
      localStorage.setItem('playto_username', userName.trim());
      setLiking(true);
      try {
        await onLike(userName.trim());
        setLiked(true);
        setShowInput(false);
        setUserName('');
      } catch (err) {
        console.error('Like failed:', err);
      } finally {
        setLiking(false);
      }
    }
  };

  const iconSize = size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const fontSize = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="flex flex-col items-center relative">
      {/* Like Button */}
      <button
        onClick={handleLikeClick}
        disabled={liking}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          liked
            ? 'text-red-500 bg-red-50 scale-110'
            : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
        } disabled:opacity-50`}
        title="Like"
      >
        <svg 
          className={`${iconSize} transition-transform ${liked ? 'scale-110' : ''}`} 
          fill={liked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>

      {/* Like Count */}
      <span className={`font-bold ${fontSize} ${
        liked ? 'text-red-500' : 'text-slate-600'
      }`}>
        {score}
      </span>

      {/* Username Input Popup */}
      {showInput && (
        <div className="absolute left-full ml-2 top-0 z-50 bg-white border border-slate-200 rounded-lg p-3 shadow-lg min-w-[180px]">
          <p className="text-xs text-slate-500 mb-2">Enter your username to like:</p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && userName.trim()) {
                handleLikeClick();
              }
            }}
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleLikeClick}
              disabled={liking || !userName.trim()}
              className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Like
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="px-3 py-1.5 text-slate-500 text-sm hover:text-slate-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LikeButton;
