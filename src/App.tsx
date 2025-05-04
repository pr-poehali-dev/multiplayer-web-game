
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Index from './pages/Index'
import Game from './pages/Game'
import NotFound from './pages/NotFound'
import RoundSetup from './pages/RoundSetup'
import MultiCursor from './components/MultiCursor'

function App() {
  return (
    <Router>
      <MultiCursor />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/game" element={<Game />} />
        <Route path="/round-setup" element={<RoundSetup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
