// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Premium from './pages/premium';

const App = () => (
  <div>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/premium" element={<Premium />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
 