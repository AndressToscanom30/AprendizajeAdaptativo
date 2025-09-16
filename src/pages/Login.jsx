import { useState } from 'react';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Recaptcha from '../components/Recaptcha';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = Boolean(email.trim()) && Boolean(password) && Boolean(captchaToken) && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Completa el formulario y verifica el reCAPTCHA.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('Iniciando sesión', { email, remember, captchaToken });
    } catch {
      setError('No se pudo iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 items-stretch">
        <div className="relative overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none bg-white shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
          <div className="relative p-8 h-full flex flex-col items-center justify-center text-center">
            <img
              src="/AA-logo.png"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-6"
              alt="Logo Aprendizaje Adaptativo"
            />
            <h2 className="text-2xl font-bold text-gray-800">Aprendizaje Adaptativo</h2>
            <p className="text-sm text-gray-500 mt-2">Inicia sesión para continuar</p>
          </div>
        </div>
        <div className="bg-white rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@email.com"
                  className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="remember" className="flex items-center gap-2 text-gray-700 text-sm">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Recordarme
              </label>
              <Link to="/recuperarPass" className="text-blue-600 hover:underline text-sm">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Recaptcha className="pt-2" onVerify={setCaptchaToken} />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
              <span>{loading ? 'Iniciando…' : 'Iniciar Sesión'}</span>
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;