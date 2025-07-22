// Espera a que el DOM esté listo
window.addEventListener("DOMContentLoaded", function () {
  const precios = {
    cerdo: 15000,
    pollo: 15000,
    mixto: 15000,
    domicilio: 5000,
  };

  let cantidades = {
    cerdo: 0,
    pollo: 0,
    mixto: 0,
  };

  const resumenPasteles = document.getElementById("pastelResumen");
  const totalBar = document.getElementById("totalBar");
  const botonPedir = document.getElementById("pedirAhora");
  const formulario = document.getElementById("formularioPedido");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeGracias = document.getElementById("mensajeGracias");
  const volverInicio = document.getElementById("volverInicio");
  const seccionFormulario = document.getElementById("formulario");
  const imagenQR = document.getElementById("qrField");

 function actualizarResumen() {
  const totalPasteles = cantidades.cerdo + cantidades.pollo + cantidades.mixto;
  const totalPrecio = totalPasteles * precios.cerdo + (totalPasteles > 0 ? precios.domicilio : 0);

  document.getElementById("btnEnviarPedido").disabled = totalPasteles === 0;

  document.getElementById("cantidadCerdo").textContent = cantidades.cerdo;
  document.getElementById("cantidadPollo").textContent = cantidades.pollo;
  document.getElementById("cantidadMixto").textContent = cantidades.mixto;

  document.getElementById("resCerdo").innerText = cantidades.cerdo;
  document.getElementById("resPollo").innerText = cantidades.pollo;
  document.getElementById("resMixto").innerText = cantidades.mixto;
  document.getElementById("resTotalPasteles").innerText = totalPasteles;
  document.getElementById("resTotalPrecio").innerText = `$${totalPrecio.toLocaleString()}`;

  document.getElementById("totalBar").textContent = `Total + Domicilio: $${totalPrecio.toLocaleString()}`;

}

  function incrementar(tipo) {
    cantidades[tipo]++;
    actualizarResumen();
  }

  function decrementar(tipo) {
    if (cantidades[tipo] > 0) {
      cantidades[tipo]--;
      actualizarResumen();
    }
  }

  window.incrementar = incrementar;
  window.decrementar = decrementar;

  btnEnviarPedido.addEventListener("click", function () {
     mensajeError.textContent = "";

  const totalPasteles = cantidades.cerdo + cantidades.pollo + cantidades.mixto;
  if (totalPasteles === 0) {
    mensajeError.textContent = "Selecciona al menos un producto.";
    return;
  }

  let camposValidos = true;
  formulario.querySelectorAll("input, select").forEach((input) => {
    input.classList.remove("error-input");
    if (!input.value.trim()) {
      input.classList.add("error-input");
      camposValidos = false;
    }
  });

  if (!camposValidos) {
    mensajeError.textContent = "Por favor completa todos los campos del formulario.";
    seccionFormulario.scrollIntoView({ behavior: "smooth" });
    return;
  }

    // Construcción del mensaje de WhatsApp
    const nombre = formulario.nombre.value;
    const direccion = formulario.direccion.value;
    const metodoPago = formulario.metodoPago.value;
    const total = cantidades.cerdo + cantidades.pollo + cantidades.mixto;
    const valorTotal = total * precios.cerdo + precios.domicilio;

  // Fecha y hora
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString("es-CO");
  const hora = ahora.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  // Construcción dinámica del pedido
  let detallePedido = "";
  if (cantidades.pollo > 0) detallePedido += `     🐔 Pastel de Pollo: ${cantidades.pollo}\n`;
  if (cantidades.cerdo > 0) detallePedido += `     🐷 Pastel de Cerdo: ${cantidades.cerdo}\n`;
  if (cantidades.mixto > 0) detallePedido += `     (🐔🐷) Pastel Mixto: ${cantidades.mixto}\n`;

  // Mensaje final
  let mensaje = `Candelaria Sabor y Sazón
📆 ${fecha} - ${hora}
----------------------------------------------------------
Hola, soy ${nombre}. Quiero hacer un pedido:

📦 Pedido:
${detallePedido}Total pasteles: ${totalPasteles}

🏠 Dirección: ${direccion}
📞 WhatsApp: 3102622195
----------------------------------------------------------
💳 Pago: ${metodoPago}
💰 Total + domicilio: $${totalPesos.toLocaleString("es-CO")}
----------------------------------------------------------`;

    const url = `https://wa.me/573102622195?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    formulario.reset();
    cantidades = { cerdo: 0, pollo: 0, mixto: 0 };
    actualizarResumen();
    mensajeGracias.style.display = "block";
    formulario.style.display = "none";
  });

  volverInicio.addEventListener("click", function () {
    formulario.style.display = "block";
    mensajeGracias.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const metodoPagoSelect = document.getElementById("metodoPago");
  metodoPagoSelect.addEventListener("change", function () {
    if (this.value === "transferencia") {
      imagenQR.style.display = "block";
    } else {
      imagenQR.style.display = "none";
    }
  });

  actualizarResumen();
});