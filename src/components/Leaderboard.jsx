import React from 'react';

function Leaderboard({ data }) {
  return (
    <div className="bg-white rounded-lg shadow sticky top-8">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">Top 5 users by karma in the last 24 hours</p>

        {data.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No karma earned yet</p>
        ) : (
          <div className="space-y-3">
            {data.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                    ${index === 0 ? 'bg-yellow-500' : ''}
                    ${index === 1 ? 'bg-gray-400' : ''}
                    ${index === 2 ? 'bg-amber-600' : ''}
                    ${index > 2 ? 'bg-gray-300' : ''}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">
                      {user.karma_24h} karma
                    </p>
                  </div>
                </div>
                
                {index === 0 && (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
