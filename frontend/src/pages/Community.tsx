import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Post {
  _id: string;
  author: string;
  content: string;
  likes: number;
  createdAt: string;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: 'Anonymous Youth', content })
      });
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold">Community Forum</h1>
          <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">Back Home</Link>
        </header>

        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Share your thoughts or ask for advice..."
            rows={3}
          />
          <div className="mt-4 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700">
              Post
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {posts.map(post => (
            <motion.div 
              key={post._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">{post.author}</h3>
                <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700">{post.content}</p>
            </motion.div>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center text-gray-500 py-12 bg-white rounded-2xl">
              No posts yet. Be the first to start a conversation!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
