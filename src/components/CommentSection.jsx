import React, { useState } from 'react';
import { createComment, likeComment } from '../api';
import Comment from './Comment';

function CommentSection({ postId, comments, onCommentAdded }) {
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !author.trim()) {
      setError('Both fields are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createComment({
        post: postId,
        content: newComment,
        author_name: author
      });
      setNewComment('');
      setAuthor('');
      onCommentAdded();
    } catch (err) {
      setError('Failed to post comment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t bg-gray-50 p-6">
      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="space-y-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={submitting}
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={submitting}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm transition-colors"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={postId}
              onCommentAdded={onCommentAdded}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
