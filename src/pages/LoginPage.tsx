import { useState} from 'react';
import type { FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';
import catastroImg from '../assets/catastro.jpg';

interface LoginErrors {
  username?: string;
  password?: string;
  general?: string;
}

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const navigate = useNavigate();
const validate = () => {
  const err: LoginErrors = {};

  // Validación correo
  if (!username.trim()) {
    err.username = "El correo es obligatorio";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
    err.username = "Formato de correo inválido";
  }

  // Contraseña
  if (!password) {
    err.password = "La contraseña es obligatoria";
  } else if (password.length < 4) {
    err.password = "Debe tener al menos 4 caracteres";
  }

  setErrors(err);
  return Object.keys(err).length === 0;
};

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    try {
      const res = await fetch('/api/users/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrors({ general: data?.message ?? 'Credenciales incorrectas' });
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch {
      setErrors({ general: 'No se pudo conectar al servidor' });
    }
  };

  return (
    <div className="auth-layout">
      {/* 40% FORM */}
      <div className="auth-form-side">
        <div className="form-box">
          <h2>Login</h2>

          <form onSubmit={handleLogin} className="login-form">
            <input
            type="text"
            placeholder="Correo electrónico"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}

            {errors.general && (
              <div className="error-general">{errors.general}</div>
            )}

            <button type="submit">Login</button>
          </form>

          <p>
            ¿No tienes una cuenta? <a href="/register">Registrarse</a>
          </p>
        </div>
      </div>

      {/* 60% IMAGEN */}
      <div
        className="auth-image-side"
         style={{ backgroundImage: `url(${catastroImg})` }}
      />
    </div>
  );
}

export default LoginPage;
