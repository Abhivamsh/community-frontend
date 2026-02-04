import React, { useState } from 'react';
import { createComment, likeComment } from '../api';

function CommentThread({ comment, postId, onCommentAdded, depth = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [showLikeInput, setShowLikeInput] = useState(false);
  const [liked, setLiked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLike = async () => {
    // Check localStorage for saved username
    const savedName = localStorage.getItem('playto_username');
    
    if (savedName) {
      setLiking(true);
      try {
        await likeComment(comment.id, savedName);
        setLiked(true);
        onCommentAdded();
      } catch (err) {
        console.error('Failed to like comment:', err);
      } finally {
        setLiking(false);
      }
    } else {
      setShowLikeInput(true);
    }
  };

  const handleLikeWithName = async (name) => {
    if (!name.trim()) return;
    
    localStorage.setItem('playto_username', name.trim());
    setLiking(true);
    try {
      await likeComment(comment.id, name.trim());
      setLiked(true);
      setShowLikeInput(false);
      onCommentAdded();
    } catch (err) {
      console.error('Failed to like comment:', err);
    } finally {
      setLiking(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyAuthor.trim()) return;

    setSubmitting(true);
    try {
      await createComment({
        post: postId,
        parent: comment.id,
        content: replyContent,
        author_name: replyAuthor
      });
      setReplyContent('');
      setReplyAuthor('');
      setShowReplyForm(false);
      onCommentAdded();
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min. ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr. ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const maxDepth = 10;
  const threadLineColors = [
    'border-blue-400',
    'border-sky-400',
    'border-cyan-400',
    'border-blue-500',
    'border-sky-500',
    'border-cyan-500',
    'border-blue-300',
    'border-sky-300',
  ];

  return (
    <div className={`${depth > 0 ? 'ml-4 pl-3 border-l-2 ' + threadLineColors[depth % threadLineColors.length] : ''}`}>
      <div className="py-2">
        {/* Comment Header */}
        <div className="flex items-center gap-2 text-xs mb-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {collapsed ? '[+]' : '[-]'}
          </button>
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {comment.author?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="font-medium text-blue-500 hover:underline cursor-pointer">
            {comment.author?.username || 'anonymous'}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-400">{formatTimeAgo(comment.created_at)}</span>
        </div>

        {!collapsed && (
          <>
            {/* Comment Content */}
            <div className="text-slate-700 text-sm mb-2 whitespace-pre-wrap pl-7">
              {comment.content}
            </div>

            {/* Comment Actions */}
            <div className="flex items-center gap-1 text-xs text-slate-400 pl-7">
              {/* Like button for comments */}
              <button
                onClick={handleLike}
                disabled={liking}
                className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all ${
                  liked 
                    ? 'text-red-500 bg-red-50' 
                    : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                } disabled:opacity-50`}
              >
                <svg 
                  className="w-4 h-4" 
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
                <span className={`font-medium ${liked ? 'text-red-500' : 'text-slate-600'}`}>
                  {comment.like_count || 0}
                </span>
              </button>

              {showLikeInput && (
                <LikeInputPopup 
                  onSubmit={handleLikeWithName}
                  onClose={() => setShowLikeInput(false)}
                />
              )}

              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors ml-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </button>
              <button className="px-2 py-0.5 rounded hover:bg-slate-100 transition-colors">
                Share
              </button>
              <button className="px-2 py-0.5 rounded hover:bg-slate-100 transition-colors">
                ...
              </button>
            </div>

            {/* Reply Form */}
            {showReplyForm && (
              <form onSubmit={handleReply} className="mt-3 ml-7 space-y-2">
                <input
                  type="text"
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  placeholder="Your username"
                  className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  disabled={submitting}
                />
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="What are your thoughts?"
                  rows="3"
                  className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                  disabled={submitting}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting || !replyContent.trim() || !replyAuthor.trim()}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Posting...' : 'Reply'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="text-slate-500 px-3 py-1 text-xs hover:text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
              <div className="mt-1">
                {comment.replies.map(reply => (
                  <CommentThread
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                    onCommentAdded={onCommentAdded}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}

            {/* Show "Continue thread" if max depth reached */}
            {comment.replies && comment.replies.length > 0 && depth >= maxDepth && (
              <button className="text-blue-500 text-xs mt-2 ml-7 hover:underline">
                Continue this thread →
              </button>
            )}
          </>
        )}

        {collapsed && (
          <span className="text-slate-400 text-xs ml-7">
            ({comment.replies?.length || 0} children)
          </span>
        )}
      </div>
    </div>
  );
}

// Like Input Popup Component
function LikeInputPopup({ onSubmit, onClose }) {
  const [name, setName] = useState('');

  return (
    <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-lg p-3 shadow-lg min-w-[180px]">
      <p className="text-xs text-slate-500 mb-2">Enter username to like:</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Username"
        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && name.trim()) {
            onSubmit(name);
          }
        }}
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSubmit(name)}
          disabled={!name.trim()}
          className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Like
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-slate-500 text-sm hover:text-slate-700 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default CommentThread;
