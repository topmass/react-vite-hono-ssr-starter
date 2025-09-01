import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { HomePage, AboutPage } from './pages';
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* 🧭 Navigation - add new links in components/Navigation.tsx */}
        <Navigation />
        
        <Routes>
          {/* 📄 Pages - add new routes here, create pages in pages/ folder */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* 
            🚀 To add a new page:
            1. Create: pages/NewPage.tsx  
            2. Export: pages/index.ts
            3. Import above and add: <Route path="/new" element={<NewPage />} />
          */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
