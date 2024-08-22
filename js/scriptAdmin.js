document.addEventListener('DOMContentLoaded', async () => {

    const listaProductos = document.querySelector('#listaProductos');
    let productos = await getProductos();

    document.getElementById('btnBuscar').addEventListener('click', async () => {
        const inputValue = document.getElementById('busquedaAdmin').value.trim();

        if(inputValue !== "") {
            productos = await getProductosByID(inputValue);
        } else {
            productos = await getProductos(); 
        }

        renderizarProductos(productos);
    });


    renderizarProductos(productos);

});

function renderizarProductos(productos) {
    let body = "";
    let count = 0;

    for (let producto of productos) {
        if (count === 0) {
            body += `<div class="row">`;
        }
        body += `
           <div class="col-md-4">
                <div class="card h-100 mb-4 shadow-sm">
                    <img src="${producto.image}" class="card-img-top" alt="Producto 1">
                    <div class="card-body">
                        <h5 class="card-title">${producto.title}</h5>
                        <span>${producto.description}</span>
                        <span><strong>${producto.category}</strong></span>
                        <span>Precio: ${producto.price} $</span>
                        <div class="d-flex justify-content-between">
                            
                            <!-- Botón Actualizar -->
                            <button class="btn btn-info btn-sm" onclick="actualizarProducto(${producto.id})">Actualizar</button>
                            <!-- Botón Eliminar -->
                            <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        count++;

        if (count === 3) {
            body += `</div>`;
            count = 0;
        }
    }

    document.querySelector('#listaProductos').innerHTML = body;
}

function actualizarProducto(id) {
    alert('Actualizar producto con ID: ' + id);
}

function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        alert('Producto con ID: ' + id + ' ha sido eliminado.');
    }
}

const getProductos = async () => {
    const response = await fetch('http://localhost:3000/productos', {
        method: 'GET',
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    });
    return await response.json();
}

const getProductosByID = async (id) => {
    const response = await fetch(`http://localhost:3000/productos/${id}`, {
        method: 'GET',
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    });
    return await response.json();
}