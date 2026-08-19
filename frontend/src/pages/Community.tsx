import React from 'react';

const Community = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Anonymous Community</h1>
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 font-bold">C</div>
              <div>
                <div className="font-semibold text-gray-900">CalmExplorer42</div>
                <div className="text-xs text-gray-500">2 hours ago • Career Confusion</div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Anyone else feeling like everyone around them has their life completely figured out? I just changed my major for the third time and I'm terrified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
