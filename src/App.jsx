import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100 text-slate-800">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="/submit" element={<CreatePostPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
