import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/ui/empty-state';
import { Skeleton } from '../components/ui/skeleton';
import { Search, BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { resourceService, type ResourceItem } from '../services/resourceService';
import { AppShell } from '../components/layout/AppShell';
import { staggerContainerVariants, fadeUpVariants } from '../lib/motion';
import { GuideReaderModal } from '../components/resources/GuideReaderModal';

const FALLBACK_RESOURCES: ResourceItem[] = [
  {
    _id: '1',
    title: 'Managing Academic Pressure & Exam Fatigue',
    category: 'Academic Pressure',
    readTimeMinutes: 5,
    description: 'Evidence-based cognitive restructuring and Pomodoro pacing to handle heavy coursework deadlines without mental exhaustion.',
    content: `Academic pressure frequently leads to cognitive tunnel vision, where students overestimate threat and underestimate their internal coping resources.

### The Neurobiology of Exam Anxiety
Under acute time constraints, the sympathetic nervous system triggers elevated adrenaline and cortisol. While moderate arousal sharpens focus (the Yerkes-Dodson Law), prolonged stress impairs the prefrontal cortex—the very region needed for deductive reasoning and critical memory retrieval.

### The 3-Step Cognitive De-escalation Protocol
1. **Structured Pomodoro Anchoring**: Instead of cramming for 4 hours uninterrupted, study in dedicated 25-minute intervals followed by 5 minutes of total visual disengagement.
2. **Active Recall over Passive Review**: Testing yourself using practice flashcards or teaching a concept aloud consolidates memory 60% faster than highlighting textbooks.
3. **Post-Exam Mental Closure**: After completing an exam, intentionally file away notes and take a 20-minute physical walk outdoors to signal mental completion to your nervous system.`,
    author: 'YOUTH Clinical Care Team',
  },
  {
    _id: '2',
    title: '5 Practical Grounding Techniques for Acute Anxiety',
    category: 'Anxiety & Stress',
    readTimeMinutes: 4,
    description: 'Somatic sensory exercises and vagus nerve stimulation to regain composure when panic or distress begins to escalate.',
    content: `When acute anxiety strikes, the brain is caught in predictive threat forecasting. Grounding techniques force sensory reintegration with the physical present.

### 1. The 5-4-3-2-1 Sensory Scan
Identify 5 things you can visually see, 4 physical sensations you feel (e.g. feet on floor, watch on wrist), 3 distinct sounds, 2 distinct scents, and 1 deep breath.

### 2. The 4-7-8 Parasympathetic Brake
Inhale deeply through your nose for 4 seconds, hold gently for 7 seconds, and exhale steadily through your mouth for 8 seconds. This activates the vagus nerve and downregulates elevated heart rates within 90 seconds.

### 3. Somatic Temperature Shock (Mammalian Dive Reflex)
Splashing cold water on your face or holding an ice cube stimulates cold thermoreceptors, triggering rapid heart rate deceleration.

### 4. Progressive Muscle Release
Clench your fists and shoulders tightly for 5 seconds, then deliberately release all tension on a slow exhalation.

### 5. Ground Contact Anchor
Press both feet flat against the hard floor and focus all attentional weight on the soles of your feet.`,
    author: 'YOUTH Wellness Lab',
  },
  {
    _id: '3',
    title: 'Sleep Hygiene Protocols for College Students',
    category: 'Sleep',
    readTimeMinutes: 6,
    description: 'Actionable steps to fix your circadian rhythm, reduce blue light disruption, and wake refreshed before morning lectures.',
    content: `Sleep is not passive downtime—it is the biological window where the glymphatic system cleans neurotoxins and hippocampus memories are consolidated into long-term storage.

### Circadian Light Alignment
- **Morning Sunlight**: Get 10-15 minutes of outdoor sunlight within 45 minutes of waking up to set your master biological clock.
- **Nighttime Blue Light Attenuation**: Switch laptop screens and mobile phones to warm night filters at least 60 minutes before bed.

### The 10-3-2-1-0 Sleep Architecture
- **10 hours before bed**: No more caffeine or stimulant energy drinks.
- **3 hours before bed**: No heavy meals or vigorous exercise.
- **2 hours before bed**: Cease intense academic work or exam cramming.
- **1 hour before bed**: Zero blue screens or social media doomscrolling.
- **0**: The number of times you hit snooze the next morning.`,
    author: 'Dr. Ananya Sharma, MD',
  },
  {
    _id: '4',
    title: 'Navigating Social Anxiety & Campus Connections',
    category: 'Relationships',
    readTimeMinutes: 7,
    description: 'Psychological tools to overcome social hesitation, reframe the spotlight effect, and build authentic friendships.',
    content: `College transitions and social circles can often spark intense feelings of isolation or fear of negative judgment.

### Reframing the Spotlight Effect
Psychological research demonstrates that people overestimate how much others notice their minor flaws or awkward moments by over 500%. Most peers are equally preoccupied with their own belonging.

### Actionable Connection Steps
1. **Micro-Interactions**: Start with low-stakes greetings with classmates or dorm neighbors.
2. **Shared Activity Hubs**: Join interest-based campus clubs or study pods where conversations naturally center around shared tasks rather than pure small talk.
3. **Empathy Listening**: Shift attention outward from internal self-critique to actively asking curious questions about others.`,
    author: 'YOUTH Counseling Network',
  },
  {
    _id: '5',
    title: 'Financial Stress & Budget Anxiety Management',
    category: 'Financial Stress',
    readTimeMinutes: 8,
    description: 'Coping strategies for tuition and living expense worries while maintaining focus on your academic path.',
    content: `Financial worries regarding tuition, living expenses, and daily budgets are among the top drivers of chronic student distress.

### Reducing Money-Related Panic
- **Establish a Bare-Bones Weekly Budget**: Separate essentials (rent, food, transit) from variable discretionary spending.
- **Access Campus Student Welfare Funds**: Most universities offer emergency student grants, textbook libraries, and subsidised dining programs.
- **Time-Boxed Financial Reviews**: Schedule 15 minutes once a week on Sundays to review expenses rather than checking banking apps in high-anxiety moments.`,
    author: 'YOUTH Advisory Board',
  },
  {
    _id: '6',
    title: 'Preventing Academic Burnout & Restoring Flow',
    category: 'Academic Pressure',
    readTimeMinutes: 5,
    description: 'Recognizing neurochemical burnout warning signs and implementing structured mental white space.',
    content: `Burnout is not a personal failure of willpower—it is an energetic deficit resulting from prolonged nervous arousal without adequate recovery cycles.

### Recognizing Early Burnout Signals
- Persistent emotional cynicism toward coursework and campus life.
- Chronic physical fatigue unaffected by standard sleep durations.
- Brain fog and paralysis when starting standard assignments.

### The Systematic Recovery Framework
1. **Protected White Space**: Block out at least 3 hours every weekend free of study materials, deadlines, or screens.
2. **Micro-Downtime**: Take 2 minutes between lectures to practice non-focused daydreaming or gentle neck stretches.`,
    author: 'YOUTH Clinical Care Team',
  }
];

const CATEGORIES = ['All', 'Anxiety & Stress', 'Academic Pressure', 'Sleep', 'Relationships', 'Financial Stress'];

export const ResourceHub = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<ResourceItem | null>(null);

  useEffect(() => {
    async function loadResources() {
      setLoading(true);
      try {
        const catQuery = activeCategory === 'All' ? undefined : activeCategory;
        const res = await resourceService.getResources(catQuery, search || undefined);
        if (res.success && res.data && res.data.length > 0) {
          // Merge with fallback rich content if API content is empty
          const enriched = res.data.map((item) => {
            const fallback = FALLBACK_RESOURCES.find(
              (f) => f.title.toLowerCase() === item.title.toLowerCase() || f._id === item._id
            );
            return {
              ...item,
              content: item.content || fallback?.content || '',
              description: item.description || fallback?.description || '',
              author: item.author || fallback?.author || 'YOUTH Clinical Care Team',
            };
          });
          setResources(enriched);
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

  const relatedGuides = selectedGuide
    ? resources.filter((r) => r._id !== selectedGuide._id)
    : [];

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
          className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs"
        >
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search guides, topics, or stress techniques..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer active:scale-[0.98] ${
                  activeCategory === c
                    ? 'bg-[#111827] text-white shadow-xs font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
              <Card key={i} className="p-6 space-y-3 rounded-2xl">
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
                    onClick={() => setSelectedGuide(resource)}
                    className="p-5 sm:p-6 h-full flex flex-col justify-between space-y-4 rounded-2xl border-slate-200/90 hover:border-emerald-300 hover:shadow-md cursor-pointer group transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="primary" size="sm">
                          {resource.category}
                        </Badge>
                        <span className="text-[11px] font-medium text-slate-400 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {resource.readTimeMinutes || 5} min
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#111827] leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3 font-normal">
                        {resource.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Read full guide
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Full Guide Reader Modal */}
      <GuideReaderModal
        isOpen={Boolean(selectedGuide)}
        guide={selectedGuide}
        onClose={() => setSelectedGuide(null)}
        onSelectRelated={(guide) => setSelectedGuide(guide)}
        relatedGuides={relatedGuides}
      />
    </AppShell>
  );
};

export default ResourceHub;
