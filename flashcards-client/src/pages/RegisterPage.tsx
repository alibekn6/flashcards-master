import { AuthForm } from '../components/AuthForm';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState('');

  const handleRegister = async (email: string, password: string) => {
    try {
      console.log('Register attempt:', { email }); // Debug
      await authApi.register(email, password);
      const user = await authApi.getCurrentUser();
      setUser(user);
      navigate('/folders');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Register error:', err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <AuthForm type="register" onSubmit={handleRegister} />
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};