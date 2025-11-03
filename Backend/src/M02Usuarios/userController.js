import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { User, Course, CourseStudent } from "../config/relaciones.js";
import { transporter } from "../config/mailer.js";

// Obtener todos los usuarios (para admin/profesor)
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ["id", "nombre", "email", "rol", "createdAt"],
      order: [["nombre", "ASC"]]
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol /*turnstileToken */ } = req.body;

    if (!nombre || !email || !password /*|| !turnstileToken*/) {
      return res
        .status(400)
        .json({ msg: "Faltan campos obligatorios o captcha" });
    }

    /*const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
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
    }*/

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
  try {
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

    console.log(code);

    res.json({ message: "Código de recuperación enviado al correo." });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar el código." });
    console.log(error);
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
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
};

// ===== GESTIÓN DE RELACIONES ESTUDIANTE-PROFESOR =====

// Obtener todos los estudiantes con sus profesores asignados
export const obtenerEstudiantesConProfesores = async (req, res) => {
  try {
    const estudiantes = await User.findAll({
      where: { rol: "estudiante" },
      attributes: ["id", "nombre", "email", "createdAt"],
      include: [
        {
          model: Course,
          as: "cursosInscritos",
          attributes: ["id", "titulo"],
          include: [
            {
              model: User,
              as: "profesor",
              attributes: ["id", "nombre", "email"]
            }
          ],
          through: { attributes: ["estado", "inscrito_en"] }
        }
      ]
    });

    // Formatear respuesta para mostrar qué profesores tiene cada estudiante
    const estudiantesFormateados = estudiantes.map(est => {
      const profesoresUnicos = new Map();
      
      est.cursosInscritos.forEach(curso => {
        if (curso.profesor) {
          profesoresUnicos.set(curso.profesor.id, {
            id: curso.profesor.id,
            nombre: curso.profesor.nombre,
            email: curso.profesor.email,
            cursos: []
          });
        }
      });

      est.cursosInscritos.forEach(curso => {
        if (curso.profesor && profesoresUnicos.has(curso.profesor.id)) {
          profesoresUnicos.get(curso.profesor.id).cursos.push({
            id: curso.id,
            titulo: curso.titulo,
            estado: curso.CourseStudent.estado,
            inscrito_en: curso.CourseStudent.inscrito_en
          });
        }
      });

      return {
        id: est.id,
        nombre: est.nombre,
        email: est.email,
        createdAt: est.createdAt,
        profesores: Array.from(profesoresUnicos.values())
      };
    });

    res.json(estudiantesFormateados);
  } catch (error) {
    console.error("Error al obtener estudiantes con profesores:", error);
    res.status(500).json({ message: "Error al obtener estudiantes" });
  }
};

// Obtener todos los profesores con sus estudiantes
export const obtenerProfesoresConEstudiantes = async (req, res) => {
  try {
    const profesores = await User.findAll({
      where: { rol: "profesor" },
      attributes: ["id", "nombre", "email", "createdAt"],
      include: [
        {
          model: Course,
          as: "cursosCreados",
          attributes: ["id", "titulo", "codigo"],
          include: [
            {
              model: User,
              as: "estudiantes",
              attributes: ["id", "nombre", "email"],
              through: { attributes: ["estado", "inscrito_en"] }
            }
          ]
        }
      ]
    });

    // Formatear para mostrar estudiantes únicos por profesor
    const profesoresFormateados = profesores.map(prof => {
      const estudiantesUnicos = new Map();
      
      prof.cursosCreados.forEach(curso => {
        curso.estudiantes.forEach(est => {
          if (!estudiantesUnicos.has(est.id)) {
            estudiantesUnicos.set(est.id, {
              id: est.id,
              nombre: est.nombre,
              email: est.email,
              cursos: []
            });
          }
          estudiantesUnicos.get(est.id).cursos.push({
            id: curso.id,
            titulo: curso.titulo,
            codigo: curso.codigo,
            estado: est.CourseStudent.estado,
            inscrito_en: est.CourseStudent.inscrito_en
          });
        });
      });

      return {
        id: prof.id,
        nombre: prof.nombre,
        email: prof.email,
        createdAt: prof.createdAt,
        totalCursos: prof.cursosCreados.length,
        estudiantes: Array.from(estudiantesUnicos.values())
      };
    });

    res.json(profesoresFormateados);
  } catch (error) {
    console.error("Error al obtener profesores con estudiantes:", error);
    res.status(500).json({ message: "Error al obtener profesores" });
  }
};

// Verificar si un estudiante está asignado a un profesor
export const verificarRelacionEstudianteProfesor = async (req, res) => {
  try {
    const { estudianteId, profesorId } = req.query;

    if (!estudianteId || !profesorId) {
      return res.status(400).json({ 
        message: "Se requieren estudianteId y profesorId" 
      });
    }

    // Buscar cursos del profesor donde esté inscrito el estudiante
    const cursosCompartidos = await Course.findAll({
      where: { profesorId },
      include: [
        {
          model: User,
          as: "estudiantes",
          where: { id: estudianteId },
          attributes: ["id", "nombre", "email"],
          through: { attributes: ["estado", "inscrito_en"] }
        }
      ]
    });

    const estaRelacionado = cursosCompartidos.length > 0;

    res.json({
      estaRelacionado,
      cursos: cursosCompartidos.map(c => ({
        id: c.id,
        titulo: c.titulo,
        codigo: c.codigo,
        estado: c.estudiantes[0].CourseStudent.estado,
        inscrito_en: c.estudiantes[0].CourseStudent.inscrito_en
      }))
    });
  } catch (error) {
    console.error("Error al verificar relación:", error);
    res.status(500).json({ message: "Error al verificar relación" });
  }
};

