import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FoldersPage } from './pages/FoldersPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/folders" element={<FoldersPage />} />
          <Route path="/folders/:folderId/flashcards" element={<FlashcardsPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;