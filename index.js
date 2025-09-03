require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const mainRouter = require("./src/api/routes/main");
const { connectCloudinary } = require("./src/config/cloudinary");
const cors = require("cors");

const app = express();

connectDB();
connectCloudinary();

// ✅ Middleware CORS completo
const allowedOrigins = ['https://chueks-frontend-4xc6-eight.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Permite llamadas desde herramientas locales como Postman
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Muy importante: permitir OPTIONS
app.options('*', cors());

app.use(express.json());
app.use("/api/v1", mainRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});


app.listen(3000, () => {
  console.log("http://localhost:3000");
});
