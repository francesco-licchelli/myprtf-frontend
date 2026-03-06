import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import GridBackground from './components/GridBackground'
import CursorGlow from './components/CursorGlow'
import Home from './pages/Home'

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))

export default function App() {
  return (
    <>
      <CursorGlow />
      <GridBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<Suspense fallback={null}><ProjectDetail /></Suspense>} />
      </Routes>
      <footer className="footer">
        <p>&copy; 2026 Francesco Licchelli. Built with React.</p>
      </footer>
    </>
  )
}
