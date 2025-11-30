import { useState} from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import catastroImg from '../assets/catastro.jpg';

interface RegisterErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const navigate = useNavigate();
const validate = () => {
  const err: RegisterErrors = {};

  // Validación correo
  if (!username.trim()) {
    err.username = "El correo es obligatorio";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
    err.username = "Formato de correo inválido";
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

  setErrors(err);
  return Object.keys(err).length === 0;
};



  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert('Usuario registrado con éxito');
    navigate('/');
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
            placeholder="Correo electrónico"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={validate}
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validate}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validate}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
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
