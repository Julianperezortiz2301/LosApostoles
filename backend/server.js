import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/usuarios", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Servidor corriendo correctamente " });
});
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` API disponible en http://localhost:${PORT}/api/usuarios`);
});