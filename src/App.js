import React from 'react';
import CodeEditor from './pages/codeeditor';
import { Routes, BrowserRouter, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CodeEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

