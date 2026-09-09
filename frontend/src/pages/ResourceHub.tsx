import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Search, Loader2, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { resourceService, type ResourceItem } from '../services/resourceService';
import { AppShell } from '../components/layout/AppShell';

const FALLBACK_RESOURCES: ResourceItem[] = [
  { _id: '1', title: 'Understanding Academic Pressure', category: 'Academic Pressure', readTimeMinutes: 5, description: 'Learn how to manage the intense demands of college coursework without burning out.', content: '', author: 'YOUTH Clinical Team' },
  { _id: '2', title: '5 Grounding Techniques for Overwhelm', category: 'Anxiety & Stress', readTimeMinutes: 4, description: 'Quick physical techniques to bring yourself back to the present moment when anxiety spikes.', content: '', author: 'YOUTH Wellness' },
  { _id: '3', title: 'How to Build a Better Sleep Routine', category: 'Sleep', readTimeMinutes: 6, description: 'Actionable steps to fix your sleep schedule and get the rest your brain needs.', content: '', author: 'YOUTH Health' },
  { _id: '4', title: 'Navigating Social Anxiety in College', category: 'Relationships', readTimeMinutes: 7, description: 'Tips for making friends and attending events when you feel socially anxious.', content: '', author: 'YOUTH Counseling' },
  { _id: '5', title: 'Financial Stress: A Student Guide', category: 'Financial Stress', readTimeMinutes: 8, description: 'Managing money anxiety while trying to focus on your degree.', content: '', author: 'YOUTH Advisory' }
];

const CATEGORIES = ['All', 'Anxiety & Stress', 'Academic Pressure', 'Sleep', 'Relationships', 'Financial Stress'];

const ResourceHub = () => {
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

    const timer = setTimeout(loadResources, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  const filtered = resources.filter(r => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AppShell title="Resource Library" subtitle="Evidence-based articles, guides, and self-help tools for student life">
      <div className="space-y-6">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search guides, topics, or stress techniques..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
            {CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  activeCategory === c 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500 space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-xs font-semibold">Loading curated guides...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(resource => (
              <Card key={resource._id} hoverable className="flex flex-col h-full rounded-3xl border-slate-200/80 p-6">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                        {resource.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {resource.readTimeMinutes || 5} min read
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mb-2 line-clamp-2">{resource.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">{resource.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Card>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200/80 border-dashed p-8">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No resources found matching your search query.</p>
                <p className="text-[11px] text-slate-400 mt-1">Try searching for broader terms like "stress" or "sleep".</p>
              </div>
            )}
          </div>
        )}

      </div>
    </AppShell>
  );
};

export default ResourceHub;


