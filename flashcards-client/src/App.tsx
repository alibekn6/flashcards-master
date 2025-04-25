import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { FoldersPage } from "./pages/FoldersPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { FlashcardsTestPage } from "./pages/FlashcardsTestPage";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/folders" element={<FoldersPage />} />
          <Route
            path="/folders/:folderId/flashcards"
            element={<FlashcardsPage />}
          />
          <Route
            path="/folders/:folderId/flashcards/test"
            element={<FlashcardsTestPage />}
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;