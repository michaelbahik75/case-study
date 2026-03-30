import { Link } from 'react-router-dom';
import { Badge } from '@mantine/core';

export default function PostCard({ post }) {
  const preview = post.content.length > 120
    ? post.content.substring(0, 120) + '...'
    : post.content;

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <Link to={`/posts/${post.id}`} className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full h-44 object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="light" size="sm">{post.author?.username}</Badge>
          <span className="text-xs text-gray-400">{date}</span>
        </div>
        <h2 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">{post.title}</h2>
        <p className="text-sm text-gray-500 line-clamp-3">{preview}</p>
      </div>
    </Link>
  );
}