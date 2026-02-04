import React, { useState } from 'react';
import { fetchPostDetail, likePost } from '../api';
import CommentSection from './CommentSection';

function Post({ post: initialPost, onUpdate }) {
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [detailedPost, setDetailedPost] = useState(null);
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
      await likePost(post.id, likerName);
      // Refresh post data to get updated like count
      const response = await fetchPostDetail(post.id);
      setPost(response.data);
      if (detailedPost) {
        setDetailedPost(response.data);
      }
      setShowLikeInput(false);
      setLikerName('');
      onUpdate();
    } catch (err) {
      console.error('Failed to like post:', err);
      alert(err.response?.data?.error || 'Failed to like post');
    } finally {
      setLiking(false);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      // Load detailed post with comments
      try {
        const response = await fetchPostDetail(post.id);
        setDetailedPost(response.data);
        setShowComments(true);
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    } else {
      setShowComments(false);
    }
  };

  const handleCommentAdded = async () => {
    // Reload post with comments
    const response = await fetchPostDetail(post.id);
    setDetailedPost(response.data);
    setPost(response.data);
    onUpdate();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {post.author?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author?.username || 'Unknown'}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

        {/* Post Actions */}
        <div className="flex items-center space-x-6 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              disabled={liking}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{post.like_count || 0}</span>
            </button>
            {showLikeInput && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={likerName}
                  onChange={(e) => setLikerName(e.target.value)}
                  placeholder="Your name"
                  className="px-2 py-1 text-sm border border-gray-300 rounded"
                  onKeyPress={(e) => e.key === 'Enter' && handleLike()}
                />
                <button
                  onClick={handleLike}
                  disabled={liking}
                  className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Like
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleToggleComments}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{showComments ? 'Hide Comments' : 'Show Comments'}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && detailedPost && (
        <CommentSection
          postId={post.id}
          comments={detailedPost.comments || []}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}

export default Post;
