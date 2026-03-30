import { useState, useEffect } from 'react';
import { getPosts } from '../api/axios';
import PostCard from '../components/PostCard';
import { TextInput, Loader } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getPosts({ page, limit: 8, search: debounced });
        setPosts(res.data.data);
        setPagination(res.data.pagination);
      } catch {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, debounced]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <TextInput
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          size="md"
          radius="lg"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-20"><Loader /></div>
      )}

      {error && (
        <p className="text-center text-red-500 py-10">{error}</p>
      )}

      {!loading && !error && (
        <>
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-2">📝</p>
              <p className="text-gray-400">No posts found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {pagination.totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}