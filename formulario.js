// Añade esta función de validación de teléfono
function validarTelefono(telefono) {
    const regex = /^[0-9]{10}$/; // Exactamente 10 dígitos
    return regex.test(telefono);
}

// Actualiza la función validateForm
function validateForm(data) {
    const camposObligatorios = [
        'nombre', 'edad', 'diagnostico', 'tipo_de_sangre',
        'contacto1_nombre', 'contacto1_parentesco', 'contacto1_telefono'
    ];
    
    // Validar campos obligatorios
    for (let campo of camposObligatorios) {
        if (!data[campo] || data[campo].trim() === '') {
            showAlert('❌ Por favor, completa todos los campos obligatorios marcados con *.', 'error');
            return false;
        }
    }
    
    // Validar teléfono del contacto 1 (10 dígitos)
    if (!validarTelefono(data.contacto1_telefono)) {
        showAlert('❌ El teléfono del Contacto 1 debe tener exactamente 10 dígitos numéricos.', 'error');
        return false;
    }
    
    // Validar teléfono del contacto 2 (si fue proporcionado)
    if (data.contacto2_telefono && data.contacto2_telefono.trim() !== '' && 
        !validarTelefono(data.contacto2_telefono)) {
        showAlert('❌ El teléfono del Contacto 2 debe tener exactamente 10 dígitos numéricos.', 'error');
        return false;
    }
    
    return true;
}