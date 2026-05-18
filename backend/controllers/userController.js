import UserModel from "../models/userModel.js";
const getUsers = async (req, res) => {
try {
const usuarios = await UserModel.getAll();
res.status(200).json({
success: true,
data: usuarios,
});
} catch (error) {
res.status(500).json({ success: false, message: error.message });
}
};
const getUserById = async (req, res) => {
try {
const { id } = req.params;
const usuario = await UserModel.getById(id);
if (!usuario) {
return res
.status(404)
.json({ success: false, message: "Usuario no encontrado" });
}
res.status(200).json({ success: true, data: usuario });
} catch (error) {
res.status(500).json({ success: false, message: error.message });
}
};
const createUser = async (req, res) => {
try {
const { nombre, email, edad } = req.body;
if (!nombre || !email || !edad) {
return res
.status(400)
.json({ success: false, message: "Todos los campos son requeridos" });
}
const result = await UserModel.create(nombre, email, edad);
res.status(201).json({
success: true,
message: "Usuario creado correctamente",
id: result.insertId,
});
} catch (error) {
if (error.code === "ER_DUP_ENTRY") {
return res
.status(409)
.json({ success: false, message: "El email ya está registrado" });
}
res.status(500).json({ success: false, message: error.message });
}
};
const updateUser = async (req, res) => {
try {
const { id } = req.params;
const { nombre, email, edad } = req.body;
if (!nombre || !email || !edad) {
return res
.status(400)
.json({ success: false, message: "Todos los campos son requeridos" });
}
const result = await UserModel.update(id, nombre, email, edad);
if (result.affectedRows === 0) {
return res
.status(404)
.json({ success: false, message: "Usuario no encontrado" });
}
res
.status(200)
.json({ success: true, message: "Usuario actualizado correctamente" });
} catch (error) {
res.status(500).json({ success: false, message: error.message });
}
};
const deleteUser = async (req, res) => {
try {
const { id } = req.params;
const result = await UserModel.remove(id);
if (result.affectedRows === 0) {
return res
.status(404)
.json({ success: false, message: "Usuario no encontrado" });
}
res
.status(200)
.json({ success: true, message: "Usuario eliminado correctamente" });
} catch (error) {
res.status(500).json({ success: false, message: error.message });
}
};
export default { getUsers, getUserById, createUser, updateUser, deleteUser };