const API_URL = 'http://localhost:3000'; // URL del API del Equipo A
let jwtToken = ''; // Variable para almacenar el JWT

// Función para iniciar sesión
function login() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

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
            fetchProducts();
        } else {
            alert('Clave  incorrectas')
        }
    })
    .catch(error => console.error('Error:', error))
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
        const productList = document.getElementById('productList')
        productList.innerHTML = '';

        data.forEach(product => {
            productList.innerHTML += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.nombre}</td>
                    <td>${product.precio}</td>
                    <td>${product.descripcion}</td>
                    <td>${product.categoria}</td>
                    <td>< img src="${product.imagen}" alt="${product.titulo}" width="100" > </td>
                   
                        
                    </td>
                </tr>
            `
        })
    })
}

// Función para crear o actualizar un producto
function saveProduct() {
    const productTitle = document.getElementById('productTitulo').value
    const productPrice = document.getElementById('productPrice').value
    const productDescription = document.getElementById('productDescription').value
    const productCategory = document.getElementById('productCategory').value
    const productImage = document.getElementById('productImage').value

    const formData = new FormData();
    formData.append('titulo', productTitle)
    formData.append('precio', productPrice)
    formData.append('descripcion', productDescription)
    formData.append('categoria', productCategory)
    formData.append('imagen', productImage)


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
    .catch(error => console.error('Error:', error))
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

// Event listeners
document.getElementById('loginButton').addEventListener('click', login)
document.getElementById('saveProduct').addEventListener('click', saveProduct)

// La lista de productos se cargará después del login exitoso