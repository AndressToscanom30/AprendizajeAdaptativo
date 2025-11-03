# 📚 Sistema de Gestión de Relaciones Estudiante-Profesor

## 🎯 Funcionalidad Implementada

Este sistema permite gestionar y consultar las relaciones entre estudiantes y profesores a través de cursos.

## 🔌 Endpoints Creados

### 1. Obtener Estudiantes con sus Profesores
**GET** `/api/users/estudiantes-profesores`

**Headers:** 
```json
{
  "Authorization": "Bearer <token>"
}
```

**Respuesta:**
```json
[
  {
    "id": "uuid-estudiante",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "profesores": [
      {
        "id": "uuid-profesor",
        "nombre": "María García",
        "email": "maria@example.com",
        "cursos": [
          {
            "id": "uuid-curso",
            "titulo": "Matemáticas I",
            "estado": "activo",
            "inscrito_en": "2024-01-01T00:00:00.000Z"
          }
        ]
      }
    ]
  }
]
```

---

### 2. Obtener Profesores con sus Estudiantes
**GET** `/api/users/profesores-estudiantes`

**Headers:** 
```json
{
  "Authorization": "Bearer <token>"
}
```

**Respuesta:**
```json
[
  {
    "id": "uuid-profesor",
    "nombre": "María García",
    "email": "maria@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "totalCursos": 2,
    "estudiantes": [
      {
        "id": "uuid-estudiante",
        "nombre": "Juan Pérez",
        "email": "juan@example.com",
        "cursos": [
          {
            "id": "uuid-curso",
            "titulo": "Matemáticas I",
            "codigo": "MAT101",
            "estado": "activo",
            "inscrito_en": "2024-01-01T00:00:00.000Z"
          }
        ]
      }
    ]
  }
]
```

---

### 3. Verificar Relación Estudiante-Profesor
**GET** `/api/users/verificar-relacion`

**Query Parameters:**
- `estudianteId` (UUID, requerido)
- `profesorId` (UUID, requerido)

**Ejemplo:**
```
/api/users/verificar-relacion?estudianteId=abc123&profesorId=def456
```

**Headers:** 
```json
{
  "Authorization": "Bearer <token>"
}
```

**Respuesta (cuando SÍ están relacionados):**
```json
{
  "estaRelacionado": true,
  "cursos": [
    {
      "id": "uuid-curso",
      "titulo": "Matemáticas I",
      "codigo": "MAT101",
      "estado": "activo",
      "inscrito_en": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Respuesta (cuando NO están relacionados):**
```json
{
  "estaRelacionado": false,
  "cursos": []
}
```

---

## 🖥️ Páginas Frontend Creadas

### 1. `/admin/relaciones` - Gestión de Relaciones
- **Vista dual:** Ver por estudiantes o por profesores
- **Búsqueda:** Filtrar por nombre o email
- **Información completa:** Muestra todos los profesores de cada estudiante y viceversa
- **Detalles de cursos:** Estado, fecha de inscripción, código de curso

### 2. `/admin/verificar` - Verificador de Relación
- **Consulta específica:** Selecciona un estudiante y un profesor
- **Respuesta visual:** Indica claramente si están relacionados o no
- **Cursos compartidos:** Lista todos los cursos donde coinciden
- **Diseño intuitivo:** Colores verde/rojo según resultado

---

## 🎨 Características de Diseño

✅ **Diseño coherente** con sistema azul/indigo  
✅ **Tarjetas `rounded-3xl`** con sombras  
✅ **Iconos Lucide:** Users, GraduationCap, Search, CheckCircle, XCircle  
✅ **Estados de carga** con spinners  
✅ **Responsive:** Grid adaptativo  
✅ **Búsqueda en tiempo real**  
✅ **Feedback visual** con colores semánticos  

---

## 🔐 Seguridad

- Todos los endpoints requieren **token JWT**
- Protección con middleware `verifyToken`
- Validación de parámetros requeridos
- Manejo de errores apropiado

---

## 📊 Lógica de Relaciones

La relación estudiante-profesor se determina a través de:

1. **Profesor crea curso** (tabla `courses.profesorId`)
2. **Estudiante se inscribe** (tabla `course_students`)
3. **Relación establecida** cuando ambos comparten al menos 1 curso activo

**Ejemplo:**
```
Profesor A crea "Matemáticas I"
  ↓
Estudiante B se inscribe en "Matemáticas I"
  ↓
Estudiante B ESTÁ relacionado con Profesor A
```

---

## 🚀 Uso en el Sistema

### Como Administrador/Profesor:
1. **Navegar a "Relaciones"** para ver todas las relaciones
2. **Cambiar vista** entre estudiantes y profesores
3. **Buscar** por nombre o email
4. **Navegar a "Verificar"** para consultas específicas
5. **Seleccionar estudiante y profesor**
6. **Obtener resultado instantáneo**

### Casos de Uso:
- ✅ Verificar asignaciones antes de crear evaluaciones
- ✅ Auditar relaciones estudiante-profesor
- ✅ Resolver dudas de inscripciones
- ✅ Generar reportes de distribución
- ✅ Validar accesos a contenido

---

## 📝 Notas Técnicas

### Modelos Sequelize Usados:
- `User` (estudiantes y profesores)
- `Course` (cursos creados por profesores)
- `CourseStudent` (tabla intermedia many-to-many)

### Relaciones:
```javascript
User.belongsToMany(Course, { 
  through: CourseStudent, 
  foreignKey: "studentId",
  as: "cursosInscritos" 
});

Course.belongsToMany(User, { 
  through: CourseStudent, 
  foreignKey: "courseId",
  as: "estudiantes" 
});

User.hasMany(Course, { 
  foreignKey: "profesorId", 
  as: "cursosCreados" 
});
```

---

## ✅ Estado de Implementación

- [x] Backend: 3 endpoints funcionales
- [x] Frontend: 2 páginas completas
- [x] Rutas en App.jsx configuradas
- [x] Navbar actualizado con enlaces
- [x] Diseño coherente con sistema existente
- [x] Manejo de estados (loading, error, empty)
- [x] Búsqueda y filtrado
- [x] Validaciones y feedback

---

## 🎯 Próximos Pasos Sugeridos

1. Implementar **asignación de evaluaciones** a estudiantes de cursos
2. Crear **dashboard de estadísticas** de relaciones
3. Agregar **exportación de reportes** PDF/Excel
4. Implementar **notificaciones** cuando estudiantes se inscriban
5. Crear **vista para estudiantes** de sus profesores

---

**Desarrollado con:** React 18 + Express.js + Sequelize + PostgreSQL
