import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flag, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { communityService, type CommunityPost } from '../services/communityService';
import { Navbar } from '../components/layout/Navbar';

const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await communityService.getPosts();
      if (res.success && res.data) setPosts(res.data);
    } catch (e) {
      console.error('Failed to fetch posts:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await communityService.createPost(newPost, category);
      setNewPost('');
      await fetchPosts();
    } catch (e) {
      console.error('Failed to create post:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await communityService.likePost(postId);
      if (res.success && res.data) {
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, likesCount: res.data!.likesCount } : p));
      }
    } catch (e) {
      console.error('Failed to like post:', e);
    }
  };

  const handleReport = async (postId: string) => {
    if (!confirm('Are you sure you want to report this post for moderation review?')) return;
    try {
      await communityService.reportContent('POST', postId, 'INAPPROPRIATE');
      alert('Post reported for review. Thank you for keeping our community safe.');
    } catch (e) {
      console.error('Failed to report post:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mb-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Peer Support Forum</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Safe, pseudonymous discussions and mutual encouragement</p>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Pseudonymous & Privacy-Protected</span>
          </div>
        </div>
        
        {/* New Post Form */}
        <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Share Your Mind</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs bg-slate-100 border-none rounded-full px-3 py-1 font-bold text-slate-700 outline-none"
            >
              <option value="General">General</option>
              <option value="College Stress">College Stress</option>
              <option value="Sleep & Habits">Sleep & Habits</option>
              <option value="Encouragement">Encouragement</option>
            </select>
          </div>

          <textarea 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write something supportive or share what you are going through..."
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white outline-none resize-none h-28 mb-4 text-sm text-slate-800"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Posts are shared under a random pseudonymous handle.</span>
            <button 
              type="submit" 
              disabled={isSubmitting || !newPost.trim()}
              className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 mr-2" />
              Post Anonymously
            </button>
          </div>
        </form>

        {/* Posts Stream */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500 font-medium bg-white rounded-3xl border border-slate-200">Loading discussions...</div>
          ) : (
            posts.map(post => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-black text-xs border border-slate-200">
                      {post.pseudonym.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{post.pseudonym}</div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {new Date(post.createdAt).toLocaleDateString()} • <span className="text-indigo-600 font-semibold">{post.category}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleReport(post._id)}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    title="Report Post"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-800 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

                <div className="pt-4 border-t border-slate-100 flex items-center space-x-6 text-xs text-slate-500 font-medium">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className="flex items-center space-x-1.5 hover:text-red-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-50" />
                    <span>{post.likesCount} Likes</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>{post.commentsCount} Comments</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {!loading && posts.length === 0 && (
            <div className="text-slate-500 text-center py-12 bg-white rounded-3xl border border-slate-200 text-sm font-medium">No posts yet. Be the first to share!</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Community;
