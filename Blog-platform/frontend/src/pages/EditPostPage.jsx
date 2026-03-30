import { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Paper, Title, Loader } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, updatePost } from '../api/axios';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', coverImage: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getPost(id).then((res) => {
      const { title, content, coverImage } = res.data;
      setForm({ title, content, coverImage: coverImage || '' });
    }).finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await updatePost(id, form);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><Loader /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Paper shadow="sm" p="xl" radius="lg">
        <Title order={3} className="mb-6">Edit Post</Title>
        <div className="space-y-4">
          <TextInput
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextInput
            label="Cover Image URL (optional)"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />
          <Textarea
            label="Content"
            minRows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <Button loading={loading} onClick={handleSubmit}>Save Changes</Button>
            <Button variant="subtle" onClick={() => navigate(`/posts/${id}`)}>Cancel</Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}