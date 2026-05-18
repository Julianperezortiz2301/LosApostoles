const API_URL = "http://localhost:3000/api/usuarios/"; 
// Elementos del DOM
const userForm = document.getElementById("user-form");
const userIdInput = document.getElementById("user-id");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const edadInput = document.getElementById("edad");
const formTitle = document.getElementById("form-title");
const btnSubmit = document.getElementById("btn-submit");
const btnCancel = document.getElementById("btn-cancel");
const usersTbody = document.getElementById("users-tbody");

const searchIdInput = document.getElementById("search-id");
const btnSearch = document.getElementById("btn-search");
const searchResult = document.getElementById("search-result");

// Al cargar la página, traer todos los usuarios (GET)
document.addEventListener("DOMContentLoaded", getUsers);

// 1. OBTENER TODOS LOS USUARIOS (GET /)
async function getUsers() {
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        
        if (json.success) {
            renderUsers(json.data);
        } else {
            alert("Error al cargar usuarios: " + json.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor backend");
    }
}

// Pintar los usuarios en la tabla
function renderUsers(usuarios) {
    usersTbody.innerHTML = "";
    if (usuarios.length === 0) {
        usersTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay usuarios registrados</td></tr>`;
        return;
    }

    usuarios.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${user.edad}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="prepareEdit(${user.id}, '${user.nombre}', '${user.email}', ${user.edad})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Eliminar</button>
            </td>
        `;
        usersTbody.appendChild(tr);
    });
}

// 2. CREAR O ACTUALIZAR USUARIO (POST / o PUT /:id)
userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = userIdInput.value;
    const userData = {
        nombre: nombreInput.value,
        email: emailInput.value,
        edad: parseInt(edadInput.value)
    };

    try {
        let response;
        if (id) {
            // Si hay ID, estamos editando (PUT /:id)
            response = await fetch(`${API_URL}${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
        } else {
            // Si no hay ID, estamos creando (POST /)
            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
        }

        const json = await response.json();
        
        if (json.success) {
            alert(json.message || "Operación exitosa");
            resetForm();
            getUsers(); // Recargar la lista
        } else {
            alert("Error: " + json.message);
        }
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// 3. BUSCAR UN USUARIO POR ID (GET /:id)
btnSearch.addEventListener("click", async () => {
    const id = searchIdInput.value;
    if (!id) return alert("Ingresa un ID válido");

    try {
        const res = await fetch(`${API_URL}${id}`);
        const json = await res.json();

        if (json.success) {
            const user = json.data;
            searchResult.innerHTML = `
                <div class="result-card">
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>Nombre:</strong> ${user.nombre}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Edad:</strong> ${user.edad}</p>
                </div>
            `;
        } else {
            searchResult.innerHTML = `<p class="text-error">${json.message}</p>`;
        }
    } catch (error) {
        console.error("Error al buscar:", error);
    }
});

// 4. ELIMINAR USUARIO (DELETE /:id)
async function deleteUser(id) {
    if (!confirm(`¿Estás seguro de eliminar al usuario con ID ${id}?`)) return;

    try {
        const res = await fetch(`${API_URL}${id}`, {
            method: "DELETE"
        });
        const json = await res.json();

        if (json.success) {
            alert(json.message);
            getUsers(); // Recargar tabla
        } else {
            alert("Error: " + json.message);
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// Preparar el formulario para editar
window.prepareEdit = function(id, nombre, email, edad) {
    userIdInput.value = id;
    nombreInput.value = nombre;
    emailInput.value = email;
    edadInput.value = edad;
    
    formTitle.textContent = `Editar Usuario (ID: ${id})`;
    btnSubmit.textContent = "Actualizar Usuario";
    btnSubmit.className = "btn btn-warning";
    btnCancel.style.display = "inline-block";
};

// Cancelar edición y limpiar
btnCancel.addEventListener("click", resetForm);

function resetForm() {
    userIdInput.value = "";
    userForm.reset();
    formTitle.textContent = "Crear Usuario";
    btnSubmit.textContent = "Guardar Usuario";
    btnSubmit.className = "btn btn-success";
    btnCancel.style.display = "none";
}