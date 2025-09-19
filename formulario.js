// formulario.js - JavaScript para el formulario de registro QR Angel

document.addEventListener('DOMContentLoaded', function() {
    initializeFormTheme();
    setupFormEventListeners();
});

function initializeFormTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(savedTheme === "dark" ? "dark-mode" : "light-mode");
    updateThemeButtonText();
}

function setupFormEventListeners() {
    const toggleButton = document.getElementById("toggleTheme");
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleFormTheme);
    }

    const form = document.getElementById('registroForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }
    
    setupValidacionTiempoReal();
}

function toggleFormTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light";
    
    body.classList.remove(currentTheme === "dark" ? "dark-mode" : "light-mode");
    body.classList.add(currentTheme === "dark" ? "light-mode" : "dark-mode");
    
    localStorage.setItem("theme", currentTheme === "dark" ? "light" : "dark");
    updateThemeButtonText();
}

function updateThemeButtonText() {
    const toggleButton = document.getElementById("toggleTheme");
    if (toggleButton) {
        const isDarkMode = document.body.classList.contains("dark-mode");
        toggleButton.textContent = isDarkMode ? "☀️" : "🌙";
    }
}

function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    if (!validateForm(data)) {
        return;
    }

    generateTxtFile(data);
    
    setTimeout(() => {
        form.submit();
    }, 1000);
}

function validarTelefono(telefono) {
    const regex = /^[0-9]{10}$/;
    return regex.test(telefono);
}

function mostrarErrorTelefono(campoId, mostrar) {
    const errorElement = document.querySelector(`#${campoId} + .note + .telefono-error`);
    const inputElement = document.getElementById(campoId);
    
    if (errorElement && inputElement) {
        if (mostrar) {
            errorElement.style.display = 'block';
            inputElement.style.borderColor = '#e53e3e';
        } else {
            errorElement.style.display = 'none';
            inputElement.style.borderColor = '';
        }
    }
}

function validateForm(data) {
    const camposObligatorios = [
        'nombre', 'edad', 'tipo_persona', 'diagnostico', 'tipo_de_sangre',
        'contacto1_nombre', 'contacto1_parentesco', 'contacto1_telefono'
    ];
    
    for (let campo of camposObligatorios) {
        if (!data[campo] || data[campo].trim() === '') {
            showAlert('❌ Por favor, completa todos los campos obligatorios marcados con *.', 'error');
            return false;
        }
    }
    
    if (!validarTelefono(data.contacto1_telefono)) {
        mostrarErrorTelefono('contacto1_telefono', true);
        showAlert('❌ El teléfono del Contacto 1 debe tener exactamente 10 dígitos numéricos.', 'error');
        return false;
    } else {
        mostrarErrorTelefono('contacto1_telefono', false);
    }
    
    if (data.contacto2_telefono && data.contacto2_telefono.trim() !== '') {
        if (!validarTelefono(data.contacto2_telefono)) {
            mostrarErrorTelefono('contacto2_telefono', true);
            showAlert('❌ El teléfono del Contacto 2 debe tener exactamente 10 dígitos numéricos.', 'error');
            return false;
        } else {
            mostrarErrorTelefono('contacto2_telefono', false);
        }
    }
    
    return true;
}

function setupValidacionTiempoReal() {
    const telefonoInputs = ['contacto1_telefono', 'contacto2_telefono'];
    
    telefonoInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    const esValido = validarTelefono(this.value);
                    mostrarErrorTelefono(id, !esValido);
                } else {
                    mostrarErrorTelefono(id, false);
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.value.trim() !== '') {
                    const esValido = validarTelefono(this.value);
                    mostrarErrorTelefono(id, !esValido);
                }
            });
        }
    });
}

function generateTxtFile(data) {
    const contenido = buildFileContent(data);
    const filename = `${data.nombre.toLowerCase().replace(/\s+/g, '_')}.txt`;
    
    try {
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        showAlert('✅ Archivo TXT generado. Enviando datos por correo...');
        
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
        
    } catch (error) {
        console.error('Error al generar el archivo:', error);
        showAlert('❌ Error al generar el archivo.', 'error');
    }
}

function buildFileContent(data) {
    let contenido = `# QR Angel - Protección Digital\n\n`;
    contenido += `# DATOS DE LA PERSONA\n`;
    contenido += `nombre: ${data.nombre}\n`;
    contenido += `edad: ${data.edad}\n`;
    contenido += `tipo_atencion: ${data.tipo_persona}\n`;
    contenido += `condicion: ${data.diagnostico}\n`;
    contenido += `tipo_de_sangre: ${data.tipo_de_sangre}\n`;
    contenido += `alergias: ${data.alergias || 'Ninguna'}\n\n`;
    
    contenido += `# CONTACTO DE EMERGENCIA 1\n`;
    contenido += `contacto1_nombre: ${data.contacto1_nombre}\n`;
    contenido += `contacto1_parentesco: ${data.contacto1_parentesco}\n`;
    contenido += `contacto1_telefono: ${data.contacto1_telefono}\n\n`;
    
    if (data.contacto2_nombre || data.contacto2_parentesco || data.contacto2_telefono) {
        contenido += `# CONTACTO DE EMERGENCIA 2\n`;
        contenido += `contacto2_nombre: ${data.contacto2_nombre || ''}\n`;
        contenido += `contacto2_parentesco: ${data.contacto2_parentesco || ''}\n`;
        contenido += `contacto2_telefono: ${data.contacto2_telefono || ''}\n\n`;
    }
    
    contenido += `# INFORMACIÓN ADICIONAL\n`;
    contenido += `notas: ${data.notas || 'Ninguna'}\n\n`;
    
    contenido += `# METADATOS\n`;
    contenido += `fecha_registro: ${new Date().toLocaleDateString('es-MX')}\n`;
    contenido += `hora_registro: ${new Date().toLocaleTimeString('es-MX')}\n`;
    contenido += `proyecto: QR Angel - Protección Digital\n`;
    
    return contenido;
}

function showAlert(message, type = 'success') {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;
    
    alertBox.textContent = message;
    alertBox.className = type === 'success' ? 'alert alert-success' : 'alert alert-error';
    alertBox.style.display = 'block';
    
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}