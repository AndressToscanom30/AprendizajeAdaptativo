import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { User } from "../models/index.js";

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
