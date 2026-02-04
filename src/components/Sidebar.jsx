import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ leaderboard }) {
  return (
    <div className="space-y-4">
      {/* Community Info Card */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-blue-500 to-blue-600"></div>
        
        {/* Content */}
        <div className="p-4 -mt-6">
          <div className="flex items-end gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-slate-800 mb-1">Threadly Community</h2>
          <p className="text-sm text-slate-500 mb-4">Community Feed - Share and discuss with everyone!</p>
          
          <div className="flex gap-8 text-sm mb-4">
            <div>
              <div className="font-bold text-slate-800">1.2k</div>
              <div className="text-slate-400 text-xs">Members</div>
            </div>
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                42
              </div>
              <div className="text-slate-400 text-xs">Online</div>
            </div>
          </div>

          <Link
            to="/submit"
            className="block w-full bg-blue-500 text-center text-white py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Create Post
          </Link>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h3 className="font-bold text-slate-800">Top Contributors</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Last 24 hours</p>
        </div>

        <div className="p-2">
          {leaderboard.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No karma earned yet</p>
          ) : (
            <div className="space-y-1">
              {leaderboard.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-slate-100 transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-slate-300 text-slate-700' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">
                      u/{user.username}
                    </div>
                  </div>
                  <div className="text-sm text-blue-500 font-medium">
                    {user.karma_24h} karma
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Community Rules
          </h3>
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="text-slate-400 font-medium">1.</span>
            <span className="text-slate-700">Be respectful to others</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-400 font-medium">2.</span>
            <span className="text-slate-700">No spam or self-promotion</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-400 font-medium">3.</span>
            <span className="text-slate-700">Keep discussions on topic</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-4 mt-4 text-xs text-slate-400 space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline hover:text-blue-500">Help</a>
          <a href="#" className="hover:underline hover:text-blue-500">About</a>
          <a href="#" className="hover:underline hover:text-blue-500">Careers</a>
          <a href="#" className="hover:underline hover:text-blue-500">Press</a>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline hover:text-blue-500">Terms</a>
          <a href="#" className="hover:underline hover:text-blue-500">Privacy Policy</a>
        </div>
        <p>Threadly © 2026. All rights reserved</p>
      </div>
    </div>
  );
}

export default Sidebar;
