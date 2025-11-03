import { Course, CourseStudent, User, Evaluacion } from "../config/relaciones.js";

// Crear un curso
export const crearCurso = async (req, res) => {
    try {
        const { titulo, descripcion, codigo } = req.body;
        const profesorId = req.user.id;

        if (req.user.rol !== "profesor") {
            return res.status(403).json({ message: "Solo los profesores pueden crear cursos" });
        }

        const curso = await Course.create({
            titulo,
            descripcion,
            codigo,
            profesorId
        });

        return res.status(201).json(curso);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear curso", error: error.message });
    }
};

// Obtener cursos del profesor
export const obtenerCursosProfesor = async (req, res) => {
    try {
        const profesorId = req.user.id;

        const cursos = await Course.findAll({
            where: { profesorId },
            include: [
                {
                    model: User,
                    as: "estudiantes",
                    attributes: ["id", "nombre", "email"],
                    through: { attributes: ["inscrito_en", "estado"] }
                }
            ]
        });

        return res.json(cursos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener cursos", error: error.message });
    }
};

// Obtener cursos del estudiante
export const obtenerCursosEstudiante = async (req, res) => {
    try {
        const estudianteId = req.user.id;

        const estudiante = await User.findByPk(estudianteId, {
            include: [
                {
                    model: Course,
                    as: "cursosInscritos",
                    include: [
                        {
                            model: User,
                            as: "profesor",
                            attributes: ["id", "nombre", "email"]
                        }
                    ],
                    through: { attributes: ["inscrito_en", "estado"] }
                }
            ]
        });

        return res.json(estudiante.cursosInscritos || []);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener cursos", error: error.message });
    }
};

// Inscribir estudiante a un curso
export const inscribirEstudiante = async (req, res) => {
    try {
        const { cursoId, estudianteId } = req.body;
        const profesorId = req.user.id;

        // Verificar que el curso pertenece al profesor
        const curso = await Course.findOne({
            where: { id: cursoId, profesorId }
        });

        if (!curso) {
            return res.status(404).json({ message: "Curso no encontrado o no tienes permiso" });
        }

        // Verificar que el usuario es estudiante
        const estudiante = await User.findOne({
            where: { id: estudianteId, rol: "estudiante" }
        });

        if (!estudiante) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        // Verificar si ya está inscrito
        const yaInscrito = await CourseStudent.findOne({
            where: { courseId: cursoId, studentId: estudianteId }
        });

        if (yaInscrito) {
            return res.status(400).json({ message: "El estudiante ya está inscrito en este curso" });
        }

        await CourseStudent.create({
            courseId: cursoId,
            studentId: estudianteId
        });

        return res.json({ message: "Estudiante inscrito exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al inscribir estudiante", error: error.message });
    }
};

// Obtener estudiantes de un curso
export const obtenerEstudiantesCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const profesorId = req.user.id;

        const curso = await Course.findOne({
            where: { id, profesorId },
            include: [
                {
                    model: User,
                    as: "estudiantes",
                    attributes: ["id", "nombre", "email"],
                    through: { 
                        attributes: ["inscrito_en", "estado"],
                        as: "inscripcion"
                    }
                }
            ]
        });

        if (!curso) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        return res.json(curso.estudiantes || []);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener estudiantes", error: error.message });
    }
};

// Eliminar estudiante de un curso
export const eliminarEstudianteCurso = async (req, res) => {
    try {
        const { cursoId, estudianteId } = req.params;
        const profesorId = req.user.id;

        // Verificar que el curso pertenece al profesor
        const curso = await Course.findOne({
            where: { id: cursoId, profesorId }
        });

        if (!curso) {
            return res.status(404).json({ message: "Curso no encontrado o no tienes permiso" });
        }

        await CourseStudent.destroy({
            where: { courseId: cursoId, studentId: estudianteId }
        });

        return res.json({ message: "Estudiante eliminado del curso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar estudiante", error: error.message });
    }
};
