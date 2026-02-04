import React, { useState } from 'react';
import { createComment, likeComment } from '../api';

function Comment({ comment, postId, onCommentAdded, depth = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [likerName, setLikerName] = useState('');
  const [showLikeInput, setShowLikeInput] = useState(false);

  const handleLike = async () => {
    if (!likerName.trim()) {
      setShowLikeInput(true);
      return;
    }

    setLiking(true);
    try {
      await likeComment(comment.id, likerName);
      setShowLikeInput(false);
      setLikerName('');
      onCommentAdded(); // Refresh to show updated like count
    } catch (err) {
      console.error('Failed to like comment:', err);
      alert(err.response?.data?.error || 'Failed to like comment');
    } finally {
      setLiking(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim() || !replyAuthor.trim()) {
      return;
    }

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

  // Limit nesting depth visually (Reddit-style)
  const maxVisualDepth = 8;
  const indentClass = depth < maxVisualDepth ? `ml-${Math.min(depth * 4, 12)}` : 'ml-12';

  return (
    <div className={depth > 0 ? `${indentClass} border-l-2 border-gray-200 pl-4` : ''}>
      <div className="bg-white rounded-lg p-4">
        {/* Comment Header */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {comment.author?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">
              {comment.author?.username || 'Unknown'}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-gray-800 text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <button
              onClick={handleLike}
              disabled={liking}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{comment.like_count || 0}</span>
            </button>
            {showLikeInput && (
              <div className="flex items-center space-x-1 ml-2">
                <input
                  type="text"
                  value={likerName}
                  onChange={(e) => setLikerName(e.target.value)}
                  placeholder="Your name"
                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                  onKeyPress={(e) => e.key === 'Enter' && handleLike()}
                />
                <button
                  onClick={handleLike}
                  disabled={liking}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Like
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Reply
          </button>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReply} className="mt-4 space-y-2">
            <input
              type="text"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              placeholder="Your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={submitting}
            />
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={submitting}
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-xs transition-colors"
              >
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId}
              onCommentAdded={onCommentAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
