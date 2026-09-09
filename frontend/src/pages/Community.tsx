import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flag, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { communityService, type CommunityPost } from '../services/communityService';
import { AppShell } from '../components/layout/AppShell';

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
    <AppShell title="Peer Community" subtitle="Safe, pseudonymous discussions & mutual encouragement">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* New Post Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Share Your Reflection</span>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-1 font-semibold text-slate-700 outline-none"
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
            placeholder="Write something supportive or share what you are experiencing..."
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white outline-none resize-none h-28 mb-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 transition-all"
          />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-400 font-semibold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Shared under a safe pseudonymous handle. No personal ID exposed.
            </span>

            <button 
              type="submit" 
              disabled={isSubmitting || !newPost.trim()}
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>Post Anonymously</span>
            </button>
          </div>
        </form>

        {/* Posts Stream */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 text-slate-500 font-semibold text-xs bg-white rounded-3xl border border-slate-200/80">Loading community stream...</div>
          ) : (
            posts.map(post => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center font-black text-xs border border-blue-100 shadow-sm">
                      {post.pseudonym.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{post.pseudonym}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        {new Date(post.createdAt).toLocaleDateString()} • <span className="text-blue-6-[700] font-bold">{post.category}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleReport(post._id)}
                    className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                    title="Report Content"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center space-x-6 text-xs text-slate-500 font-bold">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className="flex items-center space-x-1.5 hover:text-rose-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-50" />
                    <span>{post.likesCount} Support</span>
                  </button>

                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} Replies</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {!loading && posts.length === 0 && (
            <div className="text-slate-500 text-center py-16 bg-white rounded-3xl border border-slate-200/80 text-xs font-semibold">No discussions yet. Be the first to share an encouraging note!</div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Community;

