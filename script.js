// Manejo del tema oscuro/claro
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  const body = document.body;

  // Aseguramos que solo se aplique un modo a la vez
  body.classList.add(savedTheme === "dark" ? "dark-mode" : "light-mode");
});

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light";

  // Remover clase actual y aplicar la opuesta
  body.classList.remove(currentTheme === "dark" ? "dark-mode" : "light-mode");
  body.classList.add(currentTheme === "dark" ? "light-mode" : "dark-mode");

  // Guardar preferencia
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
}

// Geolocalización - Solo si el elemento existe (en perfil.html)
document.getElementById("obtenerUbicacion")?.addEventListener("click", () => {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = ""; // Limpiar resultados anteriores

  if (!navigator.geolocation) {
    const errorP = document.createElement("p");
    errorP.textContent = "❌ Tu navegador no soporta geolocalización.";
    resultadoDiv.appendChild(errorP);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lon = position.coords.longitude.toFixed(6);

      const pUbicacion = document.createElement("p");
      pUbicacion.textContent = "📍 Ubicación obtenida:";
      resultadoDiv.appendChild(pUbicacion);

      const pLat = document.createElement("p");
      pLat.textContent = `Latitud: ${lat}`;
      resultadoDiv.appendChild(pLat);

      const pLon = document.createElement("p");
      pLon.textContent = `Longitud: ${lon}`;
      resultadoDiv.appendChild(pLon);

      const link = document.createElement("a");
      link.href = `https://maps.google.com/?q=${lat},${lon}`;
      link.target = "_blank";
      link.textContent = "Ver en Google Maps";
      resultadoDiv.appendChild(link);
    },
    (error) => {
      let mensaje = "";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          mensaje = "El usuario denegó el acceso a la ubicación.";
          break;
        case error.POSITION_UNAVAILABLE:
          mensaje = "La información de ubicación no está disponible.";
          break;
        case error.TIMEOUT:
          mensaje = "Se agotó el tiempo para obtener la ubicación.";
          break;
        default:
          mensaje = "Error desconocido.";
      }

      const errorP = document.createElement("p");
      errorP.textContent = `❌ Error: ${mensaje}`;
      resultadoDiv.appendChild(errorP);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
});