import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { likePost, fetchPostDetail } from '../api';
import LikeButton from './VoteButtons';

function PostCard({ post: initialPost, onVoteUpdate }) {
  const [post, setPost] = useState(initialPost);

  const handleLike = async (userName) => {
    try {
      await likePost(post.id, userName);
      const response = await fetchPostDetail(post.id);
      setPost(response.data);
      onVoteUpdate?.();
    } catch (err) {
      console.error('Failed to like:', err);
      throw err;
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  const truncateContent = (content, maxLength = 300) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-md border border-slate-200 hover:border-blue-400 transition-colors group shadow-sm">
      <div className="flex">
        {/* Like Column */}
        <div className="w-12 bg-slate-50 rounded-l-md flex flex-col items-center justify-center py-3 flex-shrink-0">
          <LikeButton 
            score={post.like_count || 0}
            onLike={handleLike}
          />
        </div>

        {/* Content - Wrapped in Link */}
        <div className="flex-1 min-w-0">
          <Link to={`/post/${post.id}`} className="block p-2">
            {/* Post Meta */}
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 flex-wrap">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0"></div>
              <span className="font-medium text-slate-700 hover:underline">r/community</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">Posted by</span>
              <span className="hover:underline">u/{post.author?.username || 'anonymous'}</span>
              <span className="text-slate-400">{formatTimeAgo(post.created_at)}</span>
            </div>

            {/* Post Content Preview */}
            <div className="text-base font-medium text-slate-800 mb-2 leading-snug">
              {truncateContent(post.content)}
            </div>
          </Link>

          {/* Post Actions - Outside of Link */}
          <div className="flex items-center gap-1 text-xs text-slate-500 px-2 pb-2">
            <Link to={`/post/${post.id}`} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comment_count || 0} Comments</span>
            </Link>
            <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </button>
            <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
