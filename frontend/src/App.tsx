import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QnA from './pages/QnA';
import Search from './pages/Search';
import './App.css'
import PostQuestion from './components/qna/PostQuestion';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/qna" element={<QnA />}/>
          <Route path="/search" element={<Search />}/>
          <Route path="/post-question" element={<PostQuestion></PostQuestion>} />
        </Routes>
      </Router>
    </>
  )


export default App;
