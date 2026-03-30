import { useState } from 'react';
import { Textarea, Button, Avatar } from '@mantine/core';
import { createComment, deleteComment } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ postId, comments, onRefresh }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return setError('Comment cannot be empty');
    setLoading(true);
    setError('');
    try {
      await createComment({ content, postId });
      setContent('');
      onRefresh();
    } catch {
      setError('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id);
      onRefresh();
    } catch {
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 bg-gray-50 rounded-xl p-4">
            <Avatar size="sm" radius="xl" color="blue">
              {c.author?.username?.[0]?.toUpperCase()}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{c.author?.username}</span>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{c.content}</p>
            </div>
            {user && (user.id === c.author?.id || user.role === 'admin') && (
              <button
                onClick={() => handleDelete(c.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Comment form */}
      {user ? (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minRows={3}
            error={error}
          />
          <Button size="sm" loading={loading} onClick={handleSubmit}>
            Post Comment
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          <a href="/login" className="text-blue-500 hover:underline">Login</a> to post a comment.
        </p>
      )}
    </div>
  );
}