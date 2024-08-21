document.addEventListener('DOMContentLoaded', async () => {
    const productCarousel = document.querySelector('#productCarousel');
    const products = await getProductos();
    let currentIndex = 0;
    const itemsPerPage = 4;

    function renderProducts() {
        productCarousel.innerHTML = ''; // Limpia el contenido anterior

        // Calcular el índice final, asegurando que no exceda el número de productos
        const end = Math.min(currentIndex + itemsPerPage, products.length);
        for (let i = currentIndex; i < end; i++) {
            const product = products[i];
            const productCard = `
                 <div class="card mx-2 d-flex flex-column" style="width: 18rem;"> 
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body flex-column">
                        <h5 class="card-title">${product.title.length >= 30 ? product.title.substring(0, 30) + "..." : product.title}</h5>
                        <p class="card-text">${product.description.length >=80 ? product.description.substring(0,80) + "..." : product.description }</p>
                        <h5 class="card-text">L. ${product.price.toFixed(2)}</h5>
                         <a href="#" class="btn btn-primary btn-block mt-auto">Go somewhere</a>
                    </div>
                </div>
            `;
            productCarousel.innerHTML += productCard;
        }

        // Deshabilitar o habilitar los botones según sea necesario
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex + itemsPerPage >= products.length;
    }

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex -= itemsPerPage;
            renderProducts();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentIndex + itemsPerPage < products.length) {
            currentIndex += itemsPerPage;
            renderProducts();
        }
    });

    // Renderiza los productos iniciales después de cargar el API
    renderProducts();
});

/**
 * Integración con el API
 */
const getProductos = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const productos = await response.json();
        return productos;
    } catch (error) {
        console.error(`Algún error sucedió: ${error.message}`);
        return [];
    }
}
