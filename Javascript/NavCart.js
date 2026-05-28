document.addEventListener('DOMContentLoaded', () => {
    const navCartBtn = document.querySelector('.navbar .nav-icon[aria-label="Carrito"]');
    if (!navCartBtn) return;

    const navActions = navCartBtn.closest('.nav-actions');
    if (!navActions) return;

    const cartDropdown = navActions.querySelector('.container-cart-products');
    if (!cartDropdown) return;

    let articulosCarrito = [];
    try {
        const guardado = localStorage.getItem('carritoItems');
        if (guardado) articulosCarrito = JSON.parse(guardado);
    } catch (e) { articulosCarrito = []; }

    const cartEmpty = cartDropdown.querySelector('.cart-empty');
    const valorTotal = cartDropdown.querySelector('.total-pagar');
    const contadorProductos = document.querySelector('#contador-productos');

    const openCart = () => {
        try {
            const guardado = localStorage.getItem('carritoItems');
            if (guardado) articulosCarrito = JSON.parse(guardado);
        } catch (e) { articulosCarrito = []; }
        showHTML();
        cartDropdown.classList.remove('hidden-cart');
    };

    const closeCart = () => {
        cartDropdown.classList.add('hidden-cart');
    };

    navCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (cartDropdown.classList.contains('hidden-cart')) {
            openCart();
        } else {
            closeCart();
        }
    });

    document.addEventListener('click', (e) => {
        if (cartDropdown.classList.contains('hidden-cart')) return;
        if (navActions.contains(e.target)) return;
        closeCart();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !cartDropdown.classList.contains('hidden-cart')) {
            closeCart();
        }
    });

    cartDropdown.addEventListener('click', e => {
        if (e.target.classList.contains('icono-borrar') || e.target.closest('.icono-borrar')) {
            const productRow = e.target.closest('.cart-product');
            const titulo = productRow.querySelector('.titulo-producto-carrito').textContent.trim();
            articulosCarrito = articulosCarrito.filter(p => p.titulo !== titulo);
            showHTML();
        }

        if (e.target.classList.contains('btn-restar')) {
            const productRow = e.target.closest('.cart-product');
            const titulo = productRow.querySelector('.titulo-producto-carrito').textContent.trim();
            articulosCarrito.forEach(p => { if (p.titulo === titulo) p.cantidad--; });
            articulosCarrito = articulosCarrito.filter(p => p.cantidad > 0);
            showHTML();
        }
    });

    const showHTML = () => {
        const rowProduct = cartDropdown.querySelector('.row-product');
        if (!rowProduct) return;

        rowProduct.querySelectorAll('.cart-product').forEach(p => p.remove());

        let total = 0;
        let totalOfProducts = 0;

        if (articulosCarrito.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
        } else {
            if (cartEmpty) cartEmpty.style.display = 'none';

            articulosCarrito.forEach(product => {
                const containerProduct = document.createElement('div');
                containerProduct.classList.add('cart-product');

                const precioLimpio = parseFloat(product.precio.replace('€', '').replace(',', '.'));
                total += product.cantidad * precioLimpio;
                totalOfProducts += product.cantidad;

                containerProduct.innerHTML = `
                    <div class="info-cart-product">
                        <span class="cantidad-producto-carro">${product.cantidad}</span>
                        <p class="titulo-producto-carrito">${product.titulo}</p>
                        <span class="precio-producto-carrito">${product.precio}</span>
                    </div>
                    <div class="acciones-carrito">
                        <button class="btn-restar" aria-label="Restar uno">−</button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke-width="1.5" stroke="currentColor" class="icono-borrar" aria-label="Eliminar">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>
                `;
                rowProduct.appendChild(containerProduct);
            });
        }

        const totalFinal = total.toFixed(2);
        if (valorTotal) valorTotal.innerText = `${totalFinal}€`;
        if (contadorProductos) contadorProductos.innerText = totalOfProducts;

        localStorage.setItem('totalCompra', totalFinal);
        localStorage.setItem('carritoItems', JSON.stringify(articulosCarrito));
    };

    window.irAPagar = function() {
        const totalTexto = cartDropdown.querySelector('.total-pagar').innerText;
        const soloNumero = totalTexto.replace('€', '').trim();
        localStorage.setItem('totalCompra', soloNumero);
        const dir = window.location.pathname.includes('/noticias_actualidad/') || window.location.pathname.includes('/viñas/') ? '../' : './';
        window.location.href = dir + 'Pago.html';
    };
});
