import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Search, Filter, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resourceService, type ResourceItem } from '../services/resourceService';

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
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xl font-bold text-primary-900">
            <BookOpen className="w-6 h-6 text-secondary-500" />
            <span>Resource Hub</span>
          </div>
          <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary-600">Back to Dashboard</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Mental Health Resources</h1>
          <p className="text-slate-600 text-lg">Explore our library of articles, guides, and self-help tools designed specifically for students.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search for topics, articles, or guides..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
            {CATEGORIES.map(c => (
              <button 
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 border ${
                  activeCategory === c 
                    ? 'bg-secondary-600 text-white border-secondary-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-secondary-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600 mr-2" />
            <span>Loading resources...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(resource => (
              <Card key={resource._id} hoverable className="flex flex-col h-full">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs font-semibold text-secondary-600 mb-3 uppercase tracking-wider">{resource.category}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{resource.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{resource.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">{resource.readTimeMinutes || 5} min read</span>
                    <button className="text-primary-600 text-sm font-medium hover:text-primary-700 hover:underline">Read Article</button>
                  </div>
                </div>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
                <p className="text-slate-500">No resources found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResourceHub;

