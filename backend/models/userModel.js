import pool from "../config/database.js";
const getAll = async () => {
const [rows] = await pool.query("SELECT * FROM usuarios");
return rows;
};
const getById = async (id) => {
const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
return rows[0];
};
const create = async (nombre, email, edad) => {
const [result] = await pool.query(
"INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)",
[nombre, email, edad],
);
return result;
};
const update = async (id, nombre, email, edad) => {
const [result] = await pool.query(
"UPDATE usuarios SET nombre = ?, email = ?, edad = ? WHERE id = ?",
[nombre, email, edad, id],
);
return result;
};
const remove = async (id) => {
const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
return result;
};
export default { getAll, getById, create, update, remove };