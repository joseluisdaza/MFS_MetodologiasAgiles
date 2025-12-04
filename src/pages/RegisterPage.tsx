import { useState} from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import catastroImg from '../assets/catastro.jpg';

interface RegisterErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  general?: string;
}

function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const navigate = useNavigate();
const validate = () => {
  const err: RegisterErrors = {};

  if (!name.trim()) {
    err.name = "El nombre es obligatorio";
  }

  if (!username.trim()) {
    err.username = "El nombre de usuario es obligatorio";
  }

  if (!email.trim()) {
    err.email = "El correo es obligatorio";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.email = "Formato de correo inválido";
  }

  // Contraseña
  if (!password.trim()) {
    err.password = "La contraseña es obligatoria";
  } else if (password.length < 6) {
    err.password = "Debe tener al menos 6 caracteres";
  }

  // Confirmación
  if (!confirmPassword.trim()) {
    err.confirmPassword = "Debe confirmar la contraseña";
  } else if (confirmPassword !== password) {
    err.confirmPassword = "Las contraseñas no coinciden";
  }

  if (!role.trim()) {
    err.role = "El rol es obligatorio";
  } else if (!['admin','viewer'].includes(role)) {
    err.role = "Rol inválido";
  }

  setErrors(err);
  return Object.keys(err).length === 0;
};



  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    try {
      const id = crypto.randomUUID();
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrors({ general: data?.message ?? 'No se pudo registrar' });
        return;
      }

      navigate('/');
    } catch {
      setErrors({ general: 'No se pudo conectar al servidor' });
    }
  };

  return (
    <div className="auth-layout">
      {/* 40% FORM */}
      <div className="auth-form-side">
        <div className="form-box">
          <h2>Registro</h2>

          <form onSubmit={handleRegister} className="login-form">
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <span className="error-text">{errors.name}</span>
            )}

            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}

            <input
              type="text"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
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

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}

            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="viewer">viewer</option>
              <option value="admin">admin</option>
            </select>
            {errors.role && (
              <span className="error-text">{errors.role}</span>
            )}

            {errors.general && (
              <div className="error-general">{errors.general}</div>
            )}

            <button type="submit">Registrar</button>
          </form>

          <p>
            ¿Ya tienes una cuenta? <a href="/">Iniciar sesión</a>
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

export default RegisterPage;
