import React, { useState } from 'react';

function VoteButtons({ score, onVote, size = 'sm' }) {
  const [voting, setVoting] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [voteType, setVoteType] = useState(null); // 'up' or 'down' for visual feedback

  const handleVoteClick = async (type) => {
    if (!userName.trim()) {
      setShowInput(true);
      return;
    }

    setVoting(true);
    try {
      await onVote(userName);
      setVoteType(type);
      setShowInput(false);
      setUserName('');
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setVoting(false);
    }
  };

  const iconSize = size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const fontSize = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="flex flex-col items-center relative">
      {/* Upvote */}
      <button
        onClick={() => handleVoteClick('up')}
        disabled={voting}
        className={`p-1 rounded transition-colors ${
          voteType === 'up'
            ? 'text-blue-500'
            : 'text-slate-400 hover:text-blue-500 hover:bg-slate-200'
        } disabled:opacity-50`}
        title="Upvote"
      >
        <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4l-8 8h5v8h6v-8h5z" />
        </svg>
      </button>

      {/* Score */}
      <span className={`font-bold ${fontSize} ${
        voteType === 'up' ? 'text-blue-500' : 
        voteType === 'down' ? 'text-red-500' : 
        'text-slate-700'
      }`}>
        {score}
      </span>

      {/* Downvote */}
      <button
        onClick={() => handleVoteClick('down')}
        disabled={voting}
        className={`p-1 rounded transition-colors ${
          voteType === 'down'
            ? 'text-red-500'
            : 'text-slate-400 hover:text-red-500 hover:bg-slate-200'
        } disabled:opacity-50`}
        title="Downvote"
      >
        <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 20l8-8h-5V4H9v8H4z" />
        </svg>
      </button>

      {/* Username Input Popup */}
      {showInput && (
        <div className="absolute left-full ml-2 top-0 z-50 bg-white border border-slate-200 rounded-md p-2 shadow-lg min-w-[150px]">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your username"
            className="w-full bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleVoteClick('up');
              }
            }}
            autoFocus
          />
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => handleVoteClick('up')}
              disabled={voting || !userName.trim()}
              className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              Vote
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="px-2 py-1 text-slate-500 text-xs hover:text-slate-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoteButtons;
