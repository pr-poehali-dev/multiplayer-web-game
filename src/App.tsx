
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Ленивая загрузка компонентов страниц
const Index = lazy(() => import('./pages/Index'));
const Game = lazy(() => import('./pages/Game'));
const RoundSetup = lazy(() => import('./pages/RoundSetup'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Загрузка...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game" element={<Game />} />
          <Route path="/rounds" element={<RoundSetup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
