import qrcode
import json
import os

DATA_DIR = "../data"
QR_DIR = "."
LISTA_JSON = os.path.join(DATA_DIR, "lista.json")

def limpiar_nombre(nombre):
    return nombre.replace(" ", "_").lower()

def guardar_json(datos, nombre_archivo):
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    with open(os.path.join(DATA_DIR, f"{nombre_archivo}.json"), 'w', encoding='utf-8') as f:
        json.dump(datos, f, indent=4, ensure_ascii=False)

def actualizar_lista(nombre_real, nombre_archivo, tipo_persona):
    if not os.path.exists(LISTA_JSON):
        with open(LISTA_JSON, "w", encoding="utf-8") as f:
            json.dump([], f)

    with open(LISTA_JSON, "r", encoding="utf-8") as f:
        try:
            lista = json.load(f)
        except json.JSONDecodeError:
            lista = []

    if not any(item["archivo"] == nombre_archivo for item in lista):
        lista.append({
            "nombre": nombre_real,
            "archivo": nombre_archivo,
            "tipo": tipo_persona,
            "fecha_registro": os.path.getctime(LISTA_JSON) if os.path.exists(LISTA_JSON) else "N/A"
        })

    with open(LISTA_JSON, "w", encoding="utf-8") as f:
        json.dump(lista, f, indent=4, ensure_ascii=False)

def generar_qr(nombre_persona, tipo_persona):
    url_perfil = f"https://kraysek.github.io/ninios-qr/perfil.html?persona={limpiar_nombre(nombre_persona)}&tipo={tipo_persona}"
    qr = qrcode.make(url_perfil)
    nombre_archivo_qr = f"qr_{limpiar_nombre(nombre_persona)}.png"
    qr.save(os.path.join(QR_DIR, nombre_archivo_qr))
    print(f"\n✅ QR Angel generado como '{nombre_archivo_qr}'")
    print(f"🔗 Este QR lleva a: {url_perfil}")

def leer_datos_desde_txt(archivo_txt):
    datos = {}
    with open(archivo_txt, "r", encoding="utf-8") as f:
        for linea in f:
            linea = linea.strip()
            if ":" in linea and len(linea.split(":", 1)) == 2:
                clave, valor = linea.split(":", 1)
                datos[clave.strip()] = valor.strip()
    return datos

def main():
    print("\n👼 QR Angel - Registro de Personas\n")
    print("Protección digital para: niños, adultos mayores, Alzheimer, discapacidad")
    print("-" * 60)
    
    archivo_txt = input("Nombre del archivo TXT (sin extensión): ").strip() + ".txt"

    if not os.path.exists(archivo_txt):
        print(f"❌ Error: El archivo '{archivo_txt}' no existe.")
        return

    datos = leer_datos_desde_txt(archivo_txt)

    # Mapeo de campos con valores por defecto
    campos = {
        'nombre': '', 'edad': '', 'tipo_atencion': '', 'condicion': '',
        'tipo_de_sangre': '', 'alergias': 'Ninguna', 'notas': '',
        'contacto1_nombre': '', 'contacto1_parentesco': '', 'contacto1_telefono': '',
        'contacto2_nombre': '', 'contacto2_parentesco': '', 'contacto2_telefono': ''
    }

    for campo in campos:
        campos[campo] = datos.get(campo, campos[campo])

    if not campos['nombre']:
        print("❌ Error: El archivo no tiene un nombre válido.")
        return

    # Estructurar datos para JSON
    perfil = {
        "nombre": campos['nombre'],
        "edad": campos['edad'],
        "tipo_persona": campos['tipo_atencion'],
        "diagnostico": campos['condicion'],
        "tipo_de_sangre": campos['tipo_de_sangre'],
        "alergias": campos['alergias'],
        "notas": campos['notas'],
        "contacto1": {
            "nombre": campos['contacto1_nombre'],
            "parentesco": campos['contacto1_parentesco'],
            "telefono": campos['contacto1_telefono']
        }
    }

    # Agregar contacto 2 solo si existe
    if campos['contacto2_nombre'] or campos['contacto2_parentesco'] or campos['contacto2_telefono']:
        perfil["contacto2"] = {
            "nombre": campos['contacto2_nombre'],
            "parentesco": campos['contacto2_parentesco'],
            "telefono": campos['contacto2_telefono']
        }

    nombre_guardado = limpiar_nombre(campos['nombre'].split(" ")[0])

    guardar_json(perfil, nombre_guardado)
    generar_qr(campos['nombre'], campos['tipo_atencion'])
    actualizar_lista(campos['nombre'], nombre_guardado, campos['tipo_atencion'])

    print("\n✅ La persona ha sido registrada exitosamente en QR Angel.")
    print(f"📁 Datos guardados en: ../data/{nombre_guardado}.json")
    print(f"📌 Ahora aparecerá en la lista del sitio web.")

if __name__ == "__main__":
    main()