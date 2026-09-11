import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/ui/empty-state';
import { Skeleton } from '../components/ui/skeleton';
import { Search, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { resourceService, type ResourceItem } from '../services/resourceService';
import { AppShell } from '../components/layout/AppShell';
import { staggerContainerVariants, fadeUpVariants } from '../lib/motion';

const FALLBACK_RESOURCES: ResourceItem[] = [
  {
    _id: '1',
    title: 'Managing Academic Pressure & Exam Fatigue',
    category: 'Academic Pressure',
    readTimeMinutes: 5,
    description: 'Evidence-based frameworks to handle heavy coursework deadlines without mental exhaustion.',
    content: '',
    author: 'YOUTH Clinical Team',
  },
  {
    _id: '2',
    title: '5 Practical Grounding Techniques for Acute Anxiety',
    category: 'Anxiety & Stress',
    readTimeMinutes: 4,
    description: 'Somatic sensory exercises to regain composure when panic or distress begins to escalate.',
    content: '',
    author: 'YOUTH Wellness',
  },
  {
    _id: '3',
    title: 'Sleep Hygiene Protocols for College Students',
    category: 'Sleep',
    readTimeMinutes: 6,
    description: 'Actionable steps to fix your circadian rhythm, reduce blue light disruption, and wake refreshed.',
    content: '',
    author: 'YOUTH Health',
  },
  {
    _id: '4',
    title: 'Navigating Social Anxiety & Campus Connections',
    category: 'Relationships',
    readTimeMinutes: 7,
    description: 'Psychological tools to overcome social hesitation and build authentic friendships on campus.',
    content: '',
    author: 'YOUTH Counseling',
  },
  {
    _id: '5',
    title: 'Financial Stress & Budget Anxiety Management',
    category: 'Financial Stress',
    readTimeMinutes: 8,
    description: 'Coping strategies for tuition and living expense worries while focusing on your academic path.',
    content: '',
    author: 'YOUTH Advisory',
  },
];

const CATEGORIES = ['All', 'Anxiety & Stress', 'Academic Pressure', 'Sleep', 'Relationships', 'Financial Stress'];

export const ResourceHub = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      setLoading(true);
      try {
        const catQuery = activeCategory === 'All' ? undefined : activeCategory;
        const res = await resourceService.getResources(catQuery, search || undefined);
        if (res.success && res.data && res.data.length > 0) {
          setResources(res.data);
        } else {
          setResources(FALLBACK_RESOURCES);
        }
      } catch {
        setResources(FALLBACK_RESOURCES);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadResources, 250);
    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  const filtered = resources.filter((r) => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AppShell
      title="Resource Library"
      subtitle="Curated evidence-based articles, stress management protocols, and wellbeing guides"
    >
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Search & Category Filter */}
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs"
        >
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search guides, topics, or stress techniques..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-colors placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  activeCategory === c
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No matching guides found"
            description="Try searching with different keywords such as 'sleep', 'anxiety', or 'stress'."
            actionLabel="Reset Search"
            onAction={() => {
              setSearch('');
              setActiveCategory('All');
            }}
          />
        ) : (
          <motion.div
            variants={staggerContainerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {filtered.map((resource) => (
                <motion.div
                  key={resource._id}
                  variants={fadeUpVariants}
                  layout
                >
                  <Card
                    hoverable
                    className="p-5 h-full flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <Badge variant="primary" size="sm">
                          {resource.category}
                        </Badge>
                        <span className="text-[11px] text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {resource.readTimeMinutes || 5} min
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                        {resource.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                      <span>Read full guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </AppShell>
  );
};

export default ResourceHub;
