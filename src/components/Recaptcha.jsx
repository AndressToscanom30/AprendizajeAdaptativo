import ReCAPTCHA from 'react-google-recaptcha';

const Recaptcha = ({ onVerify, className = '' }) => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    return (
      <div className={`text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-3 ${className}`}>
      </div>
    );
  }

  return (
    <div className={className}>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={(token) => onVerify?.(token || null)}
        onExpired={() => onVerify?.(null)}
        hl="es"
      />
    </div>
  );
};

export default Recaptcha;
