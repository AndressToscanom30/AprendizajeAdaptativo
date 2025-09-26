import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
    try{

        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ error: "Email y contraseña obligatorios." });
        }

        const usuario = await User.findOne({ where: { email } });
        if(!usuario){
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const esValida = await bcrypt.compare(password, usuario.password);
        if(!esValida){
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        //Generación del Tokennn
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
                rol: usuario.rol
            }
        });

    } catch (error){
        console.error("Error en el login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}