import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import KnowledgeBases from './pages/KnowledgeBases';
import KnowledgeBaseDetails from './pages/KnowledgeBaseDetails'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/knowledge-bases" />} />
        <Route path="/knowledge-bases" element={<KnowledgeBases />} />
        <Route path="/knowledge-bases/:knowledgeBaseId" element={<KnowledgeBaseDetails />} /> 
      </Routes>
    </Router>
  );
}

export default App;
