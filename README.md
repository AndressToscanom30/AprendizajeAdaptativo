# Pasos para crear proyecto React con Vite y Tailwind CSS

Aquí voy a documentarles toda la creación del proyecto, pero solo tendrán que seguir los pasos que tengan --*

1. **Crear el proyecto con Vite**
    ```bash
    npm create vite@latest nombre-del-proyecto -- --template react
    cd nombre-del-proyecto
    ```

2. **Instalar dependencias**
    ```bash
    npm install 
    ```

3. **Instalar Tailwind CSS**
    ```bash
    npm install tailwindcss @tailwindcss/vite
    ```

4. **Configurar plugin de en Vite**
    En vite.config.js añadir:
    ```
        import tailwindcss from '@tailwindcss/vite'
        
        export default defineConfig({
        plugins: [
            tailwindcss(), <-- Añadir
        ],
        })
    ```

5. **Agregar Tailwind a los estilos**
    - En `src/index.css`, agregar:
      ```css
        @import "tailwindcss";
      ```

# **Iniciar el servidor de desarrollo**
    ```bash
    npm run dev
    ```
    En caso de algún error, hacer "npm install vite"

¡Listo! Ahora puedes usar clases de Tailwind en tus componentes React.