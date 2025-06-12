import qrcode
import sys

def generar_qr(nombre_nino):
    # URL del perfil del niño (GitHub Pages)
    url_perfil = f"https://kraysek.github.io/ninios-qr/perfil.html?nino={nombre_nino.lower()}"

    # Genera el QR 
    qr = qrcode.make(url_perfil)

    # Guarda el archivo con el nombre del niño
    nombre_archivo = f"qr_{nombre_nino.replace(' ', '_')}.png"
    qr.save(nombre_archivo)

    print(f"✅ QR generado correctamente como '{nombre_archivo}'")
    print(f"🔗 Este QR lleva a: {url_perfil}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Uso: python3 generar_qr_perfil.py \"Nombre del Niño\"")
        sys.exit(1)

    nombre_nino = sys.argv[1]
    generar_qr(nombre_nino)