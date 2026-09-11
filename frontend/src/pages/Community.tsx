import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flag, MessageSquare, Send, ShieldCheck, Users } from 'lucide-react';
import { communityService, type CommunityPost } from '../services/communityService';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/ui/empty-state';
import { fadeUpVariants, staggerContainerVariants } from '../lib/motion';

const CATEGORIES = ['All', 'General', 'College Stress', 'Sleep & Habits', 'Encouragement'];

export const Community = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [category, setCategory] = useState('General');
  const [selectedFilter, setSelectedFilter] = useState('All');
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
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId ? { ...p, likesCount: res.data!.likesCount } : p
          )
        );
      }
    } catch (e) {
      console.error('Failed to like post:', e);
    }
  };

  const handleReport = async (postId: string) => {
    if (!confirm('Report this post for moderation review?')) return;
    try {
      await communityService.reportContent('POST', postId, 'INAPPROPRIATE');
      alert('Post reported for review. Thank you for keeping our community safe.');
    } catch (e) {
      console.error('Failed to report post:', e);
    }
  };

  const filteredPosts =
    selectedFilter === 'All'
      ? posts
      : posts.filter((p) => p.category?.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <AppShell
      title="Peer Support Community"
      subtitle="Pseudonymous student dialogue, shared experiences, and peer encouragement"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Create post box */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Create New Reflection
            </h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share a thoughtful reflection, study routine, or message of encouragement..."
            rows={3}
            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 resize-none transition-colors outline-none"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Posts are published under an anonymous handle.</span>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={!newPost.trim() || isSubmitting}
              isLoading={isSubmitting}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Publish Post
            </Button>
          </div>
        </Card>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Post Stream */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No posts in this category yet"
              description="Be the first to share an encouraging reflection or experience with campus peers."
            />
          ) : (
            <motion.div
              variants={staggerContainerVariants}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              {filteredPosts.map((post) => (
                <motion.div key={post._id} variants={fadeUpVariants}>
                  <Card className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center font-bold text-xs border border-blue-100">
                          {post.pseudonym.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-900 block leading-tight">
                            {post.pseudonym}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="neutral" size="sm">
                          {post.category}
                        </Badge>
                        <button
                          onClick={() => handleReport(post._id)}
                          className="p-1 text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Report content"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center space-x-4 text-xs text-slate-500">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post._id)}
                        className="flex items-center space-x-1.5 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>{post.likesCount} Support</span>
                      </motion.button>

                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.commentsCount || 0} Replies</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Community;
