document.addEventListener('DOMContentLoaded', () => {

    // 1. VARIABLES
    const productos = document.querySelectorAll('.item');
    const checkboxesMarca = document.querySelectorAll('.grupo-filtro:nth-of-type(1) input[type="checkbox"]');
    const checkboxesTipo  = document.querySelectorAll('.grupo-filtro:nth-of-type(2) input[type="checkbox"]');
    const precioSlider    = document.querySelector('.input-rango');
    const precioTagMax    = document.querySelectorAll('.precio-tag')[1];
    const btnBorrar       = document.querySelector('.btn-borrar-filtros');

    const btnCart               = document.querySelector('.container-carrito');
    const containerCartProducts = document.querySelector('.container-cart-products');
    const cartEmpty             = document.querySelector('.cart-empty');   // ← mensaje vacío
    const valorTotal            = document.querySelector('.total-pagar');
    const itemsList             = document.querySelector('.container-items');
    const contadorProductos     = document.querySelector('#contador-productos');
    const numeroBurbuja         = document.querySelector('.numero-productos'); // ← burbuja

    let articulosCarrito = [];

    // 2. LÓGICA DE FILTROS
    const filtrarProductos = () => {
        const marcasSeleccionadas = Array.from(checkboxesMarca)
            .filter(i => i.checked).map(i => i.parentElement.textContent.trim());
        const tiposSeleccionados  = Array.from(checkboxesTipo)
            .filter(i => i.checked).map(i => i.parentElement.textContent.trim());
        const precioMaximo = parseFloat(precioSlider.value);

        if (precioTagMax) precioTagMax.textContent = `€${precioMaximo}.00`;

        productos.forEach(producto => {
            const marcaProd  = producto.getAttribute('data-marca');
            const tipoProd   = producto.getAttribute('data-tipo');
            const precioProd = parseFloat(producto.getAttribute('data-precio').replace(',', '.')) || 0;

            const cumpleMarca  = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(marcaProd);
            const cumpleTipo   = tiposSeleccionados.length  === 0 || tiposSeleccionados.includes(tipoProd);
            const cumplePrecio = precioProd <= precioMaximo;

            producto.style.display = (cumpleMarca && cumpleTipo && cumplePrecio) ? 'block' : 'none';
        });
    };

    // 3. ABRIR / CERRAR CARRITO
    btnCart.addEventListener('click', (e) => {
        if (e.target.closest('.icono-carrito')) {
            containerCartProducts.classList.toggle('hidden-cart');
        }
    });

    // 4. AÑADIR AL CARRITO
    itemsList.addEventListener('click', e => {
        if (e.target.classList.contains('botonAñadir')) {
            const product     = e.target.parentElement.parentElement;
            const infoProduct = {
                cantidad: 1,
                titulo:   product.querySelector('h4').textContent,
                precio:   product.querySelector('.precio').textContent,
            };

            const existe = articulosCarrito.some(p => p.titulo === infoProduct.titulo);
            if (existe) {
                articulosCarrito = articulosCarrito.map(p => {
                    if (p.titulo === infoProduct.titulo) { p.cantidad++; }
                    return p;
                });
            } else {
                articulosCarrito = [...articulosCarrito, infoProduct];
            }

            // Animación pop en la burbuja
            if (numeroBurbuja) {
                numeroBurbuja.classList.remove('pop');
                void numeroBurbuja.offsetWidth; // reflow para reiniciar animación
                numeroBurbuja.classList.add('pop');
                setTimeout(() => numeroBurbuja.classList.remove('pop'), 300);
            }

            showHTML();
        }
    });

    // 5. ACCIONES DENTRO DEL CARRITO (borrar / restar)
    containerCartProducts.addEventListener('click', e => {
        if (e.target.classList.contains('icono-borrar') || e.target.closest('.icono-borrar')) {
            const productRow = e.target.closest('.cart-product');
            const titulo     = productRow.querySelector('.titulo-producto-carrito').textContent.trim();
            articulosCarrito = articulosCarrito.filter(p => p.titulo !== titulo);
            showHTML();
        }

        if (e.target.classList.contains('btn-restar')) {
            const productRow = e.target.closest('.cart-product');
            const titulo     = productRow.querySelector('.titulo-producto-carrito').textContent.trim();
            articulosCarrito.forEach(p => { if (p.titulo === titulo) p.cantidad--; });
            articulosCarrito = articulosCarrito.filter(p => p.cantidad > 0);
            showHTML();
        }
    });

    // 6. RENDERIZAR CARRITO
    const showHTML = () => {
        // Limpiar filas anteriores
        const rowProduct = containerCartProducts.querySelector('.row-product');
        if (rowProduct) rowProduct.querySelectorAll('.cart-product').forEach(p => p.remove());

        let total          = 0;
        let totalOfProducts = 0;

        if (articulosCarrito.length === 0) {
            // ── Carrito vacío: mostrar mensaje ──
            if (cartEmpty) cartEmpty.style.display = 'block';
        } else {
            // ── Hay productos: ocultar mensaje ──
            if (cartEmpty) cartEmpty.style.display = 'none';

            articulosCarrito.forEach(product => {
                const containerProduct = document.createElement('div');
                containerProduct.classList.add('cart-product');

                const precioLimpio = parseFloat(product.precio.replace('€', '').replace(',', '.'));
                total           += product.cantidad * precioLimpio;
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

                // Insertar antes del bloque de total
                const rowProduct = containerCartProducts.querySelector('.row-product');
                if (rowProduct) rowProduct.appendChild(containerProduct);
            });
        }

        const totalFinal = total.toFixed(2);
        if (valorTotal)        valorTotal.innerText        = `${totalFinal}€`;
        if (contadorProductos) contadorProductos.innerText = totalOfProducts;

        localStorage.setItem('totalCompra', totalFinal);
    };

    // 7. EVENTOS FILTROS
    checkboxesMarca.forEach(cb => cb.addEventListener('change', filtrarProductos));
    checkboxesTipo.forEach(cb  => cb.addEventListener('change', filtrarProductos));
    if (precioSlider) precioSlider.addEventListener('input', filtrarProductos);

    if (btnBorrar) {
        btnBorrar.addEventListener('click', () => {
            checkboxesMarca.forEach(cb => cb.checked = false);
            checkboxesTipo.forEach(cb  => cb.checked = false);
            precioSlider.value = 15;
            filtrarProductos();
        });
    }

    filtrarProductos();
    showHTML();
});

// 8. IR A PAGAR
function irAPagar() {
    const totalTexto  = document.querySelector('.total-pagar').innerText;
    const soloNumero  = totalTexto.replace('€', '').trim();
    localStorage.setItem('totalFacturaDefinitivo', soloNumero);
    window.location.href = 'Pago.html';
}