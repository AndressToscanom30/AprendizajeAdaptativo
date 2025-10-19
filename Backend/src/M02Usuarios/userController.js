import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { User } from "../config/relaciones.js";
import { transporter } from "../config/mailer.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, turnstileToken } = req.body;

    if (!nombre || !email || !password || !turnstileToken) {
      return res.status(400).json({ msg: "Faltan campos obligatorios o captcha" });
    }

    const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY, 
        response: turnstileToken, 
        remoteip: req.ip, 
      }),
    });

    const validation = await turnstileResponse.json();

    if (!validation.success) {
      return res.status(400).json({
        msg: "Captcha inválido",
        codes: validation["error-codes"],
      });
    }

    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || "estudiante",
    });

    return res.status(201).json({
      msg: "Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const recuperarPassword = async (req, res) => {
  try{
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetCode = code;
    user.resetCodeExpires = expires;
    await user.save();

    await transporter.sendMail({
      from: `"Soporte - Aprendizaje Adaptativo" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `<p>Tu código de recuperación es: <b>${code}</b></p>
             <p>Este código expira en 15 minutos.</p>`,
    });

    console.log(code)
    
    res.json({ message: "Código de recuperación enviado al correo." });
  } catch (error){
    res.status(500).json({ message: "Error al enviar el código." });
    console.log(error)
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || user.resetCode !== code)
      return res.status(400).json({ message: "Código inválido" });

    if (new Date() > user.resetCodeExpires)
      return res.status(400).json({ message: "El código ha expirado" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error){
    res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
}