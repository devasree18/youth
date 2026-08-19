
const SolutionHub = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Solution Hub</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Solution Card */}
          <div className="card">
            <h3 className="font-bold text-lg mb-2 text-primary-900">Career Exploration Guide</h3>
            <p className="text-gray-600 text-sm mb-4">A structured approach to finding what you actually want to do.</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">20 mins</span>
              <button className="text-primary-600 font-medium text-sm hover:underline">Start &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionHub;
