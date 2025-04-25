import { useState } from 'react';

export const AuthForm = ({ type, onSubmit }: {
  type: 'login' | 'register';
  onSubmit: (email: string, password: string) => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    console.log('Form submitted:', { email, password }); // Debug
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            console.log('Email input changed:', e.target.value); // Debug
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            console.log('Password input changed:', e.target.value); // Debug
            setPassword(e.target.value);
          }}
        />
      </div>
      <button type="submit">
        {type === 'login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};