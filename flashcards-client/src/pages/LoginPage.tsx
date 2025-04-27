import { AuthForm } from '../components/AuthForm';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    try {
      // console.log('Login attempt:', { email });
      await authApi.login(email, password);
      const user = await authApi.getCurrentUser();
      setUser(user);
      navigate('/folders');
    } catch (error: any) {
      setError(error.message || 'Login failed');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="auth-container">
      {error && <div className="error">{error}</div>}
      <AuthForm type="login" onSubmit={handleLogin} />
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};