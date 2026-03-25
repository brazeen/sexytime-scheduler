import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateRoomPage from './pages/CreateRoomPage';
import MyRoomsPage from './pages/MyRoomsPage';
import RoomPage from './pages/RoomPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/rooms" element={<MyRoomsPage />} />
          <Route path="/room/:id" element={<RoomPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
