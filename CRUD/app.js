const API_URL = 'http://localhost:3000'; // URL del API del Equipo A
let jwtToken = ''; // Variable para almacenar el JWT
let selectedProductId = null; // Variable para almacenar el ID del producto seleccionado para editar

// Función para iniciar sesión
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre_usuario: username, contrasena: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            jwtToken = data.token;
            alert('Inicio de sesión exitoso');
            document.getElementById('loginForm').style.display = 'none';
            fetchProducts(); // Cargar la lista de productos al iniciar sesión
        } else {
            alert('Clave incorrecta');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Función para obtener todos los productos
function fetchProducts() {
    fetch(`${API_URL}/productos`, {
        headers: {
            'Authorization': jwtToken
        }
    })
    .then(response => response.json())
    .then(data => {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        data.forEach(product => {
            productList.innerHTML += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.nombre}</td>
                    <td>${product.precio}</td>
                    <td>${product.descripcion}</td>
                    <td>${product.categoria}</td>
                    <td><img src="${product.imagen}" alt="${product.nombre}" width="100"></td>
                    <td>
                        <button class="btn btn-warning" onclick="editProduct(${product.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(error => console.error('Error:', error));
}

// Función para crear o actualizar un producto
function saveProduct() {
    const productTitle = document.getElementById('productTitle').value;
    const productPrice = document.getElementById('productPrice').value;
    const productDescription = document.getElementById('productDescription').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = document.getElementById('productImage').value;

    const productData = {
        titulo: productTitle,
        precio: productPrice,
        descripcion: productDescription,
        categoria: productCategory,
        imagen: productImage
    };

    const method = selectedProductId ? 'PUT' : 'POST';
    const url = selectedProductId ? `${API_URL}/productos/${selectedProductId}` : `${API_URL}/productos`;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': jwtToken
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(() => {
        fetchProducts();
        resetForm();
    })
    .catch(error => console.error('Error:', error));
}

// Función para resetear el formulario
function resetForm() {
    document.getElementById('productTitle').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('formTitle').textContent = 'Crear Producto';
    selectedProductId = null;
}

// Función para leer un producto
function readProduct(id) {
    fetch(`${API_URL}/productos/${id}`, {
        headers: {
            'Authorization': jwtToken
        }
    })
    .then(response => response.json())
    .then(product => {
        alert(`Producto: ${product.nombre}\nPrecio: ${product.precio}\nDescripción: ${product.descripcion}`);
    })
    .catch(error => console.error('Error:', error));
}

// Función para eliminar un producto
function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': jwtToken
            }
        })
        .then(() => {
            fetchProducts();
            alert('Producto eliminado con éxito');
        })
        .catch(error => console.error('Error:', error));
    }
}

// Función para editar un producto
function editProduct(id) {
    fetch(`${API_URL}/productos/${id}`, {
        headers: {
            'Authorization': jwtToken
        }
    })
    .then(response => response.json())
    .then(product => {
        document.getElementById('productTitle').value = product.nombre;
        document.getElementById('productPrice').value = product.precio;
        document.getElementById('productDescription').value = product.descripcion;
        document.getElementById('productCategory').value = product.categoria;
        document.getElementById('productImage').value = product.imagen;
        document.getElementById('formTitle').textContent = 'Editar Producto';
        selectedProductId = product.id;
    })
    .catch(error => console.error('Error:', error));
}

// Event listeners
document.getElementById('loginButton').addEventListener('click', login);
document.getElementById('saveProduct').addEventListener('click', saveProduct);
document.getElementById('readProductButton').addEventListener('click', () => {
    const productId = document.getElementById('productId').value;
    readProduct(productId);
});
document.getElementById('deleteProductButton').addEventListener('click', () => {
    const productId = document.getElementById('productIdToDelete').value;
    deleteProduct(productId);
});

// La lista de productos se cargará después del login exitoso
