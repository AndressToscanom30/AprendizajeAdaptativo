import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, KeyRound, Lock, CheckCircle2, Loader2 } from "lucide-react";

function RecuperarPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const passwordValid = newPassword.length >= 8;

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error enviando código");
      setMessage("Código enviado a tu correo ✉️");
      setTimeout(() => setStep(2), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Ingresa el código recibido.");
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cambiar contraseña");
      setMessage("Contraseña actualizada correctamente ✅");
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step <= 3 && (
            <motion.h2
              key={step}
              className="text-2xl font-bold text-center mb-6 text-gray-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {step === 1
                ? "Recuperar contraseña"
                : step === 2
                ? "Verifica tu código"
                : "Nueva contraseña"}
            </motion.h2>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                onSubmit={handleRequestCode}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 mb-1">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Enviar código"}
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                onSubmit={handleVerifyCode}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 mb-1">Código recibido</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="text"
                      maxLength={6}
                      className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none tracking-widest"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  Verificar código
                </button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                onSubmit={handleResetPassword}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                className="space-y-4"
              >
                <div>
                  <label className="block text-gray-700 mb-1">Nueva contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5" />
                    <input
                      type="password"
                      className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  {!passwordValid && newPassword.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">La contraseña debe tener al menos 8 caracteres.</p>
                  )}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Actualizar contraseña"}
                </button>
              </motion.form>
            )}

            {step === 4 && (
              <motion.div
                key="done"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                className="text-center space-y-4"
              >
                <CheckCircle2 className="mx-auto text-green-500 h-16 w-16" />
                <p className="text-gray-700 text-lg font-medium">
                  Tu contraseña fue cambiada correctamente 🎉
                </p>
                <a
                  href="/login"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg"
                >
                  Volver al inicio de sesión
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default RecuperarPassword;
