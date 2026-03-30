import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../api/axios';
import { Button, Badge, Loader } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const res = await getPost(id);
      setPost(res.data);
    } catch {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchPost(); }, [fetchPost]);

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    await deletePost(id);
    navigate('/');
  };

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>;
  if (!post) return null;

  const isOwner = user?.id === post.author?.id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-2xl mb-6" />
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="light">{post.author?.username}</Badge>
          <span className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
        </div>
        {(isOwner || isAdmin) && (
          <div className="flex gap-2">
            <Button size="xs" variant="light" component={Link} to={`/edit/${post.id}`}>
              Edit
            </Button>
            <Button size="xs" variant="light" color="red" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <div className="prose text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>

      <hr className="my-8 border-gray-200" />

      <CommentSection
        postId={post.id}
        comments={post.comments || []}
        onRefresh={fetchPost}
      />
    </div>
  );
}