import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import Register from './components/Register';
import SavedPost from './components/SavedPost';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<CreatePost />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/saved' element={<SavedPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
