# Configuración de YouTube API

## Cómo obtener tu YouTube API Key

Sigue estos pasos para configurar la API de YouTube:

### 1. Acceder a Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google

### 2. Crear un nuevo proyecto (si no tienes uno)
1. Haz clic en el menú desplegable de proyectos (arriba a la izquierda)
2. Haz clic en "Nuevo Proyecto"
3. Dale un nombre (ej: "Aprendizaje Adaptativo")
4. Haz clic en "Crear"

### 3. Habilitar YouTube Data API v3
1. En el menú lateral, ve a **APIs y servicios** > **Biblioteca**
2. Busca "YouTube Data API v3"
3. Haz clic en "YouTube Data API v3"
4. Haz clic en el botón **HABILITAR**

### 4. Crear credenciales (API Key)
1. Ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **+ CREAR CREDENCIALES**
3. Selecciona **Clave de API**
4. Se generará una clave automáticamente
5. **COPIA** la clave generada

### 5. (Opcional pero recomendado) Restringir la API Key
1. Haz clic en "Restringir clave" o edita la clave creada
2. En "Restricciones de API":
   - Selecciona "Restringir clave"
   - Busca y selecciona "YouTube Data API v3"
3. En "Restricciones de aplicación" (opcional):
   - Puedes agregar restricciones de referente HTTP para mayor seguridad
4. Haz clic en **Guardar**

### 6. Configurar en el proyecto
1. Abre el archivo `.env` en la carpeta `Backend`
2. Reemplaza `TU_YOUTUBE_API_KEY_AQUI` con tu clave:
   ```
   YOUTUBE_API_KEY=AIzaSy...tu-clave-aqui
   ```
3. Guarda el archivo

### 7. Reiniciar el servidor
```bash
cd Backend
npm run dev
```

## Cuotas y límites

- **Cuota diaria gratuita**: 10,000 unidades/día
- **Búsqueda de videos**: 100 unidades por búsqueda
- Esto significa ~100 búsquedas gratuitas por día

## Problemas comunes

### Error: "The request cannot be completed because you have exceeded your quota"
- Has alcanzado el límite diario de 10,000 unidades
- Espera hasta el día siguiente (se resetea a medianoche hora del Pacífico)
- O solicita un aumento de cuota en Google Cloud Console

### Error: "YouTube API Key no configurada"
- Verifica que copiaste la clave correctamente en el archivo `.env`
- Asegúrate de que no haya espacios antes o después de la clave
- Reinicia el servidor backend después de modificar el `.env`

### Error: "API key not valid"
- Verifica que habilitaste YouTube Data API v3 en tu proyecto
- Comprueba que la API Key no esté restringida incorrectamente
- Asegúrate de estar usando la clave correcta del proyecto correcto

## Recursos adicionales

- [Documentación oficial de YouTube Data API](https://developers.google.com/youtube/v3)
- [Referencia de búsqueda](https://developers.google.com/youtube/v3/docs/search/list)
- [Calculadora de cuotas](https://developers.google.com/youtube/v3/determine_quota_cost)

## Características implementadas

✅ **Búsqueda inteligente con Groq AI**: La IA genera términos de búsqueda optimizados
✅ **Búsqueda de videos en YouTube**: Integración con YouTube Data API v3
✅ **Recomendaciones personalizadas**: Basadas en el perfil del estudiante
✅ **Análisis de videos**: Genera resúmenes y puntos clave
✅ **Interfaz moderna**: Diseño con Tailwind CSS y efectos animados
✅ **Modal de reproducción**: Ver videos sin salir de la aplicación
✅ **Filtros de seguridad**: Solo videos embebibles y con SafeSearch

## Endpoints disponibles

### POST `/api/recursos/generar-busquedas`
Genera términos de búsqueda optimizados con IA
```json
{
  "tema": "React Hooks",
  "nivel": "intermedio",
  "idioma": "español"
}
```

### GET `/api/recursos/videos?query=termino&maxResults=9`
Busca videos en YouTube

### POST `/api/recursos/recomendaciones`
Genera recomendaciones personalizadas
```json
{
  "temas": ["programación", "desarrollo web"],
  "nivel": "intermedio",
  "objetivos": "mejorar habilidades"
}
```

### POST `/api/recursos/analizar-video`
Analiza un video específico
```json
{
  "videoId": "dQw4w9WgXcQ",
  "titulo": "Título del video",
  "descripcion": "Descripción..."
}
```
