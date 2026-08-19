import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface Post {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
}

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts');
      if (res.ok) setPosts(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          author: user?.displayName || user?.email?.split('@')[0] || 'Anonymous', 
          content: newPost 
        })
      });
      setNewPost('');
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Anonymous Community</h1>
        
        <form onSubmit={handleSubmit} className="mb-8 card">
          <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none h-24 mb-4"
          />
          <button type="submit" className="btn-primary">Post to Community</button>
        </form>

        <div className="space-y-6">
          {posts.map(post => (
            <motion.div key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 font-bold">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{post.author}</div>
                  <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
            </motion.div>
          ))}
          
          {posts.length === 0 && (
            <div className="text-gray-500 text-center py-12 card">No posts yet. Be the first!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
