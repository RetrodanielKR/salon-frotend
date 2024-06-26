import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Schedule from './pages/Schedule';
import UserList from './pages/UserList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/user-list" element={<UserList />} />
    </Routes>
  );
}

export default App;

