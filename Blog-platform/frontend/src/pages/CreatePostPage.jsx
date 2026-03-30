import { useState } from 'react';
import { TextInput, Textarea, Button, Paper, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', coverImage: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async () => {
    if (!form.title || !form.content) return setError('Title and content are required');
    setLoading(true);
    setError('');
    try {
      const res = await createPost(form);
      navigate(`/posts/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Paper shadow="sm" p="xl" radius="lg">
        <Title order={3} className="mb-6">Create New Post</Title>
        <div className="space-y-4">
          <TextInput
            label="Title"
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextInput
            label="Cover Image URL (optional)"
            placeholder="https://..."
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />
          <Textarea
            label="Content"
            placeholder="Write your post..."
            minRows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <Button loading={loading} onClick={handleSubmit}>Publish</Button>
            <Button variant="subtle" onClick={() => navigate('/')}>Cancel</Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}