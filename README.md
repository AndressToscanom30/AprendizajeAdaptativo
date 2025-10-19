# Pasos para crear proyecto React con Vite y Tailwind CSS

Aquí voy a documentarles toda la creación del proyecto.

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

# **Dependencias Frontend que se vayan agregando**
    ```
    npm install react-router-dom
    npm install --save chart.js react-chartjs-2
    npm install lucide-react
    npm i react-google-recaptcha
    npm install node-fetch
    npm i axios
    npm install sweetalert2
    npm install jwt-decode
    ```

# **Dependecias Backend que se vayan agregando**
    ```
    npm install express dotenv cors
    npm install --save-dev nodemon
    npm install sequelize pg pg-hstore --> base de datos
    npm install bcrypt
    npm install jsonwebtoken
    npm install node-fetch
    npm install nodemailer

    sincronizar base de datos: npm run syn-db
    ```



# Recomendaciones
1. Instalar "Tailwind CSS IntelliSense" para VScode.
