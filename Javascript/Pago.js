document.addEventListener('DOMContentLoaded', () => {
    // 1. RECUPERAR EL TOTAL
    // Usamos 'totalCompra' porque es lo que vemos en tu captura de pantalla
    const totalRecuperado = localStorage.getItem('totalCompra');
    const displayTotal = document.getElementById('total-final-pago');

    console.log("Intentando cargar total:", totalRecuperado); // Esto aparecerá en tu consola (F12)

    if (totalRecuperado && displayTotal) {
        displayTotal.innerText = `${totalRecuperado}€`;
    } else if (displayTotal) {
        displayTotal.innerText = "0.00€";
    }

    // 2. LÓGICA DEL LOADER (Pantalla de carga)
    setTimeout(function() {
        const loader = document.getElementById('loader-overlay');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
    }, 1000); 

    // 3. MÁSCARAS DE INPUTS (Formateo de tarjeta)
    const cardNum = document.getElementById('card-num');
    if (cardNum) {
        cardNum.addEventListener('input', function (e) {
            let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let parts = [];
            for (let i=0; i < v.length; i+=4) {
                parts.push(v.substring(i, i+4));
            }
            e.target.value = parts.join(' ');
        });
    }

    const paypalContainer = document.querySelector('#paypal-button-container');

if (paypalContainer && typeof paypal !== 'undefined') {
    // Limpiamos por si acaso había un intento previo fallido
    paypalContainer.innerHTML = ''; 
    
    paypal.Buttons({
        style: { 
            layout: 'vertical', // Vertical suele fallar menos en espacios estrechos
            color: 'gold', 
            shape: 'rect', 
            label: 'paypal' 
        },
        createOrder: function(data, actions) {
            // Usamos el total real que rescatamos del localStorage
            const total = localStorage.getItem('totalCompra') || "0.00";
            return actions.order.create({
                purchase_units: [{
                    amount: { value: total }
                }]
            });
        }
    }).render('#paypal-button-container');
}
    // ... (resto de tus listeners para card-date y card-cvv) ...
});

// Función para el botón de pagar
function procesarPago() {
    const num = document.getElementById('card-num').value;
    const btn = document.getElementById('btn-pago');
    const success = document.getElementById('success-msg');

    if(num.length < 19) {
        alert("Introduce un número de tarjeta válido.");
        return;
    }

    btn.innerHTML = "Procesando...";
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = "Pago Completado";
        success.classList.remove('hidden');
        // Limpiamos el carrito al finalizar
        localStorage.removeItem('totalCompra');
    }, 1200);
}