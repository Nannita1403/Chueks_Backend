# 🐍 Chueks_Backend

Backend para la aplicación **Chueks**, desarrollado en Node.js + Express, conectado a MongoDB, y desplegado en Vercel. Maneja autenticación, usuarios, productos, carrito, pedidos, elementos y más.

🔗 Producción Backend: [https://chueks-backend.vercel.app](https://chueks-backend.vercel.app)  
📁 Repositorio Backend: [GitHub](https://github.com/Nannita1403/Chueks_Backend)

🔗 Producción Frontend: [https://chueks-backend.vercel.app](https://chueks-frontend.vercel.app/auth)  
📁 Repositorio Frontend: [GitHub](https://github.com/Nannita1403/chueks_frontend)
---

## 📁 Estructura del proyecto

\`\`\`
├── src/
│   └── api/
│       ├── controllers/
│       │   ├── adminDashboard.js
│       │   ├── cart.js
│       │   ├── categories.js
│       │   ├── elements.js
│       │   ├── orders.js
│       │   ├── products.js
│       │   ├── users.js
│       ├── models/
│       │   ├── cart.js
│       │   ├── category.js
│       │   ├── elements.js
│       │   ├── order.js
│       │   ├── products.js
│       │   ├── users.js
│       ├── routes/
│       │   ├── cart.js
│       │   ├── categories.js
│       │   ├── elements.js
│       │   ├── main.js
│       │   ├── meta.js
│       │   ├── orders.js
│       │   ├── products.js
│       │   ├── users.js
│   └── config/
│        ├── cloudinary.js
│        ├── db.js
│        ├── nodemailer.js
│   └── data/
│        ├── elements.seed.js
│        ├── products.seed.js
│   └── middlewares/
│        ├── checkMinItems.js
│        ├── isAdmin.js
│        ├── isAuth.js
│        ├── upload.js
│   └── utils/
│        ├── seeds/
│        │   ├── chueks.seed.js
│        ├── validations/
│        │   ├── email.js
│        ├── canonColor.js
│        ├── checkout.js
│        ├── deleteImg.js
│        ├── jwt.js
│        ├── shapeCart.js
│        ├── shapeOrder.js
├── resetColors.js
├── resetPasswords.js
├── index.js
├── .env
├── vercel.json
\`\`\`

---

## 🚀 Tecnologías utilizadas

- *Entorno de Ejecución de JavaScript*: Node.js
- *Framework web*: Express para el manejo de APIs RESTful de manera eficiente.
- *Reinicio del Servidor*: Nodemon para reiniciar automatico del servidor en desarrollo.
- *Base de Datos*: MongoDB Base de datos NoSQL para almacenamiento flexible y escalable Mongoose
- *Base de Datos*: Mongoose ODM (Object Data Modeling) para modelar y gestionar datos en MongoDB.
- *Subida de Imagenes*: Cloudinary Servicio en la nube para almacenamiento de imágenes 
- *Subida de Archivos*: Multer es un Middleware para manejar archivos multipart/form-data.
- *Subida de Archivos*: Multer Storage Cloudinary es una integración de multer con Cloudinary.
- *Correo*: Nodemailer para envío de correos electrónicos
- *Comunicación y Red*: Cors para habilitar el intercambio de recursos entre diferentes dominios (CORS).
- *Comunicación y Red*: Dotenv para el manejo de variables de entorno a través de archivos .env

---

## 🔐 Seguridad

- *Libreria para Autentificación*: JWT para autentificación basada en tokens 
- *Libreria para Autentificación*: Bcrypt para hashear contraseñas
- *Middleware* \`isAuth\`, \`isAdmin\`

---

## 🔗 Endpoints disponibles

### 🔑 Autenticación y Usuarios (\`/users\`)

| Método | Endpoint                              | Descripción                               |
|--------|---------------------------------------|-------------------------------------------|
| POST   | \`/users/register\`                   | Registrar nuevo usuario                   |
| POST   | \`/users/login\`                      | Iniciar sesión                            |
| GET    | \`/users/verifyaccount/:id\`          | Verificar cuenta                          |
| GET    | \`/users/checksession\`               | Verifica sesión activa (token)            |
| PATCH  | \`/users/update\`                     | Actualiza perfil                          |
| PATCH  | \`/users/password\`                   | Cambia contraseña                         |
| POST   | \`/users/addresses\`                  | Añadir dirección                          |
| PUT    | \`/users/addresses/:id\`              | Editar dirección                          |
| DELETE | \`/users/addresses/:id\`              | Eliminar dirección                        |
| POST   | \`/users/phones\`                     | Añadir teléfono                           |
| PUT    | \`/users/phones/:id\`                 | Editar teléfono                           |
| DELETE | \`/users/phones/:id\`                 | Eliminar teléfono                         |
| GET    | \`/users/favorites\`                  | Obtener favoritos                         |
| POST   | \`/users/favorites/:productId\`       | Agregar a favoritos                       |
| PUT    | \`/users/favorites/:productId/toggle\`| Alternar favorito                         |
| DELETE | \`/users/favorites/:productId\`       | Eliminar de favoritos                     |
| DELETE | \`/users/favorites\`                  | Limpiar todos los favoritos               |

---

### 🛒 Carrito (\`/cart\`)

| Método | Endpoint                 | Descripción                              |
|--------|--------------------------|------------------------------------------|
| GET    | \`/cart/\`               | Obtener carrito                          |
| POST   | \`/cart/add\`            | Agregar producto al carrito              |
| PATCH  | \`/cart/:productId\`     | Cambiar cantidad de producto             |
| DELETE | \`/cart/:productId\`     | Eliminar producto del carrito            |
| PATCH  | \`/cart/line/:lineId\`   | Cambiar cantidad por línea               |
| DELETE | \`/cart/line/:lineId\`   | Eliminar línea del carrito               |
| POST   | \`/cart/checkout\`       | Proceder al checkout                     |

---

### 🛍️ Productos (\`/products\`)

| Método | Endpoint                             | Descripción                                 |
|--------|--------------------------------------|---------------------------------------------|
| GET    | \`/products\`                          | Obtener todos los productos                 |
| GET    | \`/products/:id\`                      | Obtener producto por ID                     |
| GET    | \`/products/categories\`               | Categorías de productos                     |
| GET    | \`/products/dashboard\`                | Dashboard admin (estadísticas)              |
| POST   | \`/products\`                          | Crear producto (Admin)                      |
| PUT    | \`/products/:id\`                      | Editar producto (Admin)                     |
| PUT    | \`/products/toggleLike/:id/:addLike\`  | Agregar o quitar like                       |
| DELETE | \`/products/:id\`                      | Eliminar producto                           |

---

### 📁 Categorías (\`/categories\`)

| Método | Endpoint             | Descripción                               |
|--------|----------------------|-------------------------------------------|
| GET    | \`/categories\`      | Listar todas las categorías               |
| POST   | \`/categories\`      | Crear nueva categoría (Admin)             |
| PUT    | \`/categories/:id\`  | Editar categoría (Admin)                  |
| DELETE | \`/categories/:id\`  | Eliminar categoría (Admin)                |

---

### 🧩 Elementos (\`/elements\`)

| Método | Endpoint                | Descripción                              |
|--------|-------------------------|------------------------------------------|
| GET    | \`/elements\`           | Listar todos los elementos               |
| GET    | \`/elements/:id\`       | Obtener elemento por ID                  |
| POST   | \`/elements\`           | Crear nuevo elemento (Admin)             |
| PUT    | \`/elements/:id\`       | Actualizar elemento (Admin)              |
| DELETE | \`/elements/:id\`       | Eliminar elemento (Admin)                |

---

### 📦 Pedidos (\`/orders\`)

| Método | Endpoint                              | Descripción                                 |
|--------|---------------------------------------|---------------------------------------------|
| GET    | \`/orders/my-orders\`                   | Obtener pedidos del usuario                 |
| POST   | \`/orders/checkout\`                    | Crear pedido desde el carrito               |
| GET    | \`/orders\`                             | Listar todos los pedidos (Admin)            |
| GET    | \`/orders/:idOrCode\`                   | Obtener pedido por ID o código              |
| PATCH  | \`/orders/:idOrCode/status\`            | Cambiar estado del pedido (Admin)           |
| PATCH  | \`/orders/:orderId/items/:idx/picked\`  | Marcar ítem como preparado (Admin)          |

---

### 📊 Meta (\`/meta\`)

| Método | Endpoint                       | Descripción                                       |
|--------|--------------------------------|---------------------------------------------------|
| GET    | \`/meta/products/options\`     | Opciones de productos (categorías, materiales...) |
| GET    | \`/meta/elements/options\`     | Opciones de elementos (tipos, colores, etc.)      |

---

### 🌐 Principal (\`/main\`)

| Método | Endpoint           | Descripción                          |
|--------|--------------------|--------------------------------------|
| GET    | \`/main\`          | Página principal del backend         |

---

## 🧪 Scripts útiles

\`\`\`bash
npm start        # Producción
npm run dev      # Desarrollo con nodemon
npm run seed     # Carga de Seed 
node resetColors.js     # Reset visual/tablero
node resetPasswords.js  # Reset masivo de passwords
\`\`\`

---

## 📐 Diagramas

### 📌 Arquitectura general
![Arquitectura del sistema](diagramas\1_diagramaEntidadRelacion.png)

---
### 🔐 Flujo de Login

![Flujo de login](diagramas\1_pagPrinSegunLogueo.png)

\`\`\`bash
;
