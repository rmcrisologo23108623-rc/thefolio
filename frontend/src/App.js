import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Make HomePage the default landing page */}
                <Route path="/" element={<HomePage />} />
                <Route path="/welcome" element={<SplashPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/posts/:id" element={<PostPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
                <Route path="/edit-post/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
            </Routes>
            <footer>
                <p>&copy; 2026 TheFolio Blog | Contact: info@thefolio.example</p>
                <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Powered by MERN Stack</p>
            </footer>
        </>
    );
}

export default App;