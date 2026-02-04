import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPostDetail, likePost, createComment } from '../api';
import CommentThread from '../components/CommentThread';
import VoteButtons from '../components/VoteButtons';

function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sortComments, setSortComments] = useState('best');

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await fetchPostDetail(postId);
      setPost(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [postId]);

  const handleVote = async (userName) => {
    try {
      await likePost(postId, userName);
      loadPost();
    } catch (err) {
      console.error('Failed to vote:', err);
      throw err;
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || !commentAuthor.trim()) return;

    setSubmitting(true);
    try {
      await createComment({
        post: postId,
        content: commentContent,
        author_name: commentAuthor
      });
      setCommentContent('');
      loadPost();
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
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

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
          {error || 'Post not found'}
        </div>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
          ← Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Community Feed
      </Link>

      {/* Post */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm">
        <div className="flex">
          {/* Vote Column */}
          <div className="w-10 bg-slate-50 rounded-l-md flex flex-col items-center py-3">
            <VoteButtons 
              score={post.like_count || 0}
              onVote={handleVote}
              size="lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            {/* Post Meta */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {post.author?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="font-medium text-slate-700">r/community</span>
              <span>•</span>
              <span>Posted by u/{post.author?.username || 'anonymous'}</span>
              <span>{formatTimeAgo(post.created_at)}</span>
            </div>

            {/* Post Title/Content */}
            <div className="text-lg text-slate-800 mb-4 whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{post.comments?.length || 0} Comments</span>
              </div>
              <button className="flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
              <button className="flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="border-t border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-2">
            Comment as <span className="text-blue-500">{commentAuthor || 'anonymous'}</span>
          </div>
          <form onSubmit={handleSubmitComment}>
            <input
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="Your username"
              className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 mb-2"
            />
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="What are your thoughts?"
              rows="4"
              className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={submitting || !commentContent.trim() || !commentAuthor.trim()}
                className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Commenting...' : 'Comment'}
              </button>
            </div>
          </form>
        </div>

        {/* Comments Section */}
        <div className="border-t border-slate-200 p-4">
          {/* Sort Comments */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-slate-500">Sort by:</span>
            <select
              value={sortComments}
              onChange={(e) => setSortComments(e.target.value)}
              className="bg-transparent text-blue-500 font-medium focus:outline-none cursor-pointer"
            >
              <option value="best" className="bg-white">Best</option>
              <option value="top" className="bg-white">Top</option>
              <option value="new" className="bg-white">New</option>
              <option value="controversial" className="bg-white">Controversial</option>
            </select>
          </div>

          {/* Comments */}
          {post.comments?.length === 0 ? (
            <div className="text-slate-400 text-sm py-8 text-center">
              No comments yet. Be the first to share what you think!
            </div>
          ) : (
            <div className="space-y-0">
              {post.comments?.map(comment => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  onCommentAdded={loadPost}
                  depth={0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
