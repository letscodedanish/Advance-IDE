import './App.css'
import { CodingPage } from './components/CodingPage'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import io from 'socket.io-client';
import  Home  from './components/Home';
const socket = io("http://localhost:3001");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/coding" element={<CodingPage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Dashboard socket={socket} />} /> 
        <Route path="/new" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
