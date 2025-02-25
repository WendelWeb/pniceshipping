import './app.css'
import { BrowserRouter } from "react-router-dom"
import { Routes, Route } from "react-router"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import Pricing from './pages/Pricing'
function App() {

  return (
    <BrowserRouter>
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container  py-8 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
  )
}

export default App
