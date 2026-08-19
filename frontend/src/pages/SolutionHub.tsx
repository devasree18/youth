import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SolutionHub = () => {
  const categories = [
    { title: 'Mental Wellness', count: 12, color: 'bg-green-100 text-green-800' },
    { title: 'Career Paths', count: 8, color: 'bg-blue-100 text-blue-800' },
    { title: 'Skill Building', count: 24, color: 'bg-purple-100 text-purple-800' },
    { title: 'Financial Literacy', count: 5, color: 'bg-yellow-100 text-yellow-800' }
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Solution Hub</h1>
          <p className="text-xl text-gray-600">Discover resources tailored to your needs.</p>
          <div className="mt-4">
            <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-3xl ${cat.color} flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-lg transition-shadow`}
            >
              <h3 className="font-bold text-lg mb-2">{cat.title}</h3>
              <span className="bg-white bg-opacity-50 px-3 py-1 rounded-full text-sm font-medium">
                {cat.count} Resources
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolutionHub;
