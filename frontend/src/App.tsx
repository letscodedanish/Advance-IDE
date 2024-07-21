import './App.css'
import { CodingPage } from './components/CodingPage'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Dashboard />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
