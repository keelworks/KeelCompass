import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QnA from './pages/QnA';
import './App.css'
import PostQuestion from './components/qna/PostQuestion';
import PostQuestionDashboard from './components/Dashboard/PostQuestionDashboard';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          {/* <Route path="/posts/:id" element={<PostDetail />}/> */}
          <Route path="/qna" element={<QnA />}/>
          <Route path="/post-question" element={<PostQuestion></PostQuestion>} />
          <Route path='post-question-dashboard' element={<PostQuestionDashboard></PostQuestionDashboard>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App;
