import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetch from "node-fetch"; 
import User from "../M02Usuarios/User.js";

export const login = async (req, res) => {
  try {
    const { email, password, turnstileToken } = req.body;

    if (!email || !password || !turnstileToken) {
      return res
        .status(400)
        .json({ error: "Email, contraseña y captcha son obligatorios." });
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: req.ip, 
        }),
      }
    );

    const validation = await turnstileResponse.json();

    if (!validation.success) {
      return res.status(400).json({
        error: "Captcha inválido",
        codes: validation["error-codes"],
      });
    }

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const refreshToken = async (req, res) => {
  try{
    const token = req. headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token no proporcionado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto");

    const newToken = jwt.sign(
      {
        id: decoded.id, email: decoded.email
      },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1h" }
    );

    res.json({ token: newToken });
  } catch (error){
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}