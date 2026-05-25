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
    const cartEmpty             = document.querySelector('.cart-empty');   
    const valorTotal            = document.querySelector('.total-pagar');
    const itemsList             = document.querySelector('.container-items');
    const contadorProductos     = document.querySelector('#contador-productos');
    const numeroBurbuja         = document.querySelector('.numero-productos'); 

    // REPARACIÓN: Recuperar el carrito guardado previamente si existe en el navegador
    let articulosCarrito = [];
    try {
        const guardado = localStorage.getItem('carritoItems');
        if (guardado) {
            articulosCarrito = JSON.parse(guardado);
        }
    } catch (e) {
        articulosCarrito = [];
    }

    // CREACIÓN DEL ELEMENTO PARA LA NOTIFICACIÓN
    const nodoNotificacion = document.createElement('div');
    nodoNotificacion.classList.add('notificacion-carrito');
    document.body.appendChild(nodoNotificacion);

    const mostrarMensajeFlotante = (nombreProducto) => {
        nodoNotificacion.textContent = `¡${nombreProducto.toUpperCase()} AÑADIDO!`;
        nodoNotificacion.classList.add('mostrar');
        
        setTimeout(() => {
            nodoNotificacion.classList.remove('mostrar');
        }, 2000);
    };

    // 2. LÓGICA DE FILTROS
    const filtrarProductos = () => {
        const marcasSeleccionadas = Array.from(checkboxesMarca)
            .filter(i => i.checked).map(i => i.parentElement.textContent.trim());
        const tiposSeleccionados  = Array.from(checkboxesTipo)
            .filter(i => i.checked).map(i => i.parentElement.textContent.trim());
        const precioMaximo = parseFloat(precioSlider.value);

        if (precioTagMax) precioTagMax.textContent = `€${precioMaximo}.00`;

        if (precioSlider) {
            const min = precioSlider.min || 0;
            const max = precioSlider.max || 30; 
            const porcentaje = ((precioMaximo - min) / (max - min)) * 100;
            precioSlider.style.backgroundSize = `${porcentaje}% 100%`;
        }

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
        if (e.target.closest('.icono-carrito') || e.target.classList.contains('icono-carrito')) {
            containerCartProducts.classList.toggle('hidden-cart');
        }
    });

    // 4. AÑADIR AL CARRITO
    itemsList.addEventListener('click', e => {
        if (e.target.classList.contains('botonAñadir')) {
            const product     = e.target.closest('.item');
            const tituloProd  = product.querySelector('h4').textContent;
            const precioProd  = product.querySelector('.precio').textContent;
            const imgEl       = product.querySelector('figure img');
            const imagenProd  = imgEl ? imgEl.src : '';

            const infoProduct = {
                cantidad: 1,
                titulo:   tituloProd,
                precio:   precioProd,
                imagen:   imagenProd,
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

            if (numeroBurbuja) {
                numeroBurbuja.classList.remove('pop');
                void numeroBurbuja.offsetWidth; 
                numeroBurbuja.classList.add('pop');
                setTimeout(() => numeroBurbuja.classList.remove('pop'), 300);
            }

            mostrarMensajeFlotante(tituloProd);
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
        const rowProduct = containerCartProducts.querySelector('.row-product');
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
                rowProduct.appendChild(containerProduct);
            });
        }

        const totalFinal = total.toFixed(2);
        if (valorTotal)        valorTotal.innerText        = `${totalFinal}€`;
        if (contadorProductos) contadorProductos.innerText = totalOfProducts;

        // Persistencia correcta de los datos para la pasarela de pago
        localStorage.setItem('totalCompra', totalFinal);
        localStorage.setItem('carritoItems', JSON.stringify(articulosCarrito));
    };

    // 7. EVENTOS FILTROS
    checkboxesMarca.forEach(cb => cb.addEventListener('change', filtrarProductos));
    checkboxesTipo.forEach(cb  => cb.addEventListener('change', filtrarProductos));
    if (precioSlider) precioSlider.addEventListener('input', filtrarProductos);

    if (btnBorrar) {
        btnBorrar.addEventListener('click', () => {
            checkboxesMarca.forEach(cb => cb.checked = false);
            checkboxesTipo.forEach(cb  => cb.checked = false);
            precioSlider.value = 30; 
            filtrarProductos();
        });
    }

    // 8. DESPLEGAR / COLAPSAR MENÚS LATERALES
    const titulosFiltros = document.querySelectorAll('.titulo-filtro');

    titulosFiltros.forEach(titulo => {
        const grupo = titulo.closest('.grupo-filtro');
        
        if (grupo) {
            grupo.classList.add('colapsado');
            titulo.classList.add('colapsado');
        }

        titulo.addEventListener('click', () => {
            if (grupo) {
                grupo.classList.toggle('colapsado');
                titulo.classList.toggle('colapsado');
            }
        });
    });

    // 9. SEARCH BAR
    const buscador = document.getElementById('buscador');
    if (buscador) {
        buscador.addEventListener('input', () => {
            const termino = buscador.value.toLowerCase().trim();
            productos.forEach(p => {
                const titulo = p.querySelector('.titulo-item')?.textContent?.toLowerCase() || '';
                const coincide = !termino || titulo.includes(termino);
                p.style.display = coincide ? '' : 'none';
            });
        });
    }

    // EJECUCIÓN INICIAL
    filtrarProductos();
    showHTML();
});

// 10. IR A PAGAR (CORREGIDO PARA ENLAZAR CON EL HTML DE PAGO)
function irAPagar() {
    const totalTexto  = document.querySelector('.total-pagar').innerText;
    const soloNumero  = totalTexto.replace('€', '').trim();
    
    // Guardamos la misma variable exacta ('totalCompra') que busca la pasarela de pago
    localStorage.setItem('totalCompra', soloNumero);
    window.location.href = 'Pago.html';
}