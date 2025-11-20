import time
import httpx
import sys
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("Waiting for server...")
    for _ in range(10):
        try:
            httpx.get(BASE_URL)
            break
        except:
            time.sleep(1)
    else:
        print("Server not reachable")
        sys.exit(1)

    print("Server is up. Starting tests...")

    # 1. List Participants
    print("GET /participantes")
    r = httpx.get(f"{BASE_URL}/participantes")
    assert r.status_code == 200
    print(f"  Count: {len(r.json())}")

    # 2. Create Participant
    print("POST /participantes")
    new_p = {
        "ci": "99999999",
        "nombre": "Test",
        "apellido": "User",
        "email": "test@user.com"
    }
    # Try to delete first if exists (cleanup)
    httpx.delete(f"{BASE_URL}/participantes/99999999")
    
    r = httpx.post(f"{BASE_URL}/participantes/", json=new_p)
    if r.status_code == 409:
        print("  Participant already exists")
    else:
        assert r.status_code == 201
        print("  Created")

    # 3. Create Room
    print("POST /salas")
    new_room = {
        "nombre_sala": "TestRoom",
        "edificio": "Ingeniería", # Must exist in DB (inserted by init script)
        "capacidad": 10,
        "tipo_sala": "libre"
    }
    # Try to delete first
    httpx.delete(f"{BASE_URL}/salas/TestRoom/Ingeniería")
    
    r = httpx.post(f"{BASE_URL}/salas/", json=new_room)
    if r.status_code == 409:
         print("  Room already exists")
    else:
         assert r.status_code == 201
         print("  Created")

    # 4. Create Reservation
    print("POST /reservas")
    # Need a valid turn ID (1-15) and date
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    
    res_payload = {
        "nombre_sala": "TestRoom",
        "edificio": "Ingeniería",
        "fecha": tomorrow,
        "id_turno": 10,
        "participantes_ci": ["99999999"]
    }
    r = httpx.post(f"{BASE_URL}/reservas/", json=res_payload)
    if r.status_code == 201:
        res_id = r.json()["id_reserva"]
        print(f"  Created Reservation ID: {res_id}")
        
        # 5. Mark Attendance
        print(f"POST /reservas/{res_id}/asistencia")
        r = httpx.post(f"{BASE_URL}/reservas/{res_id}/asistencia", params={"ci_participante": "99999999", "asistencia": True})
        assert r.status_code == 200
        print("  Attendance marked")
        
        # 6. Cancel Reservation
        print(f"POST /reservas/{res_id}/cancelar")
        r = httpx.post(f"{BASE_URL}/reservas/{res_id}/cancelar")
        assert r.status_code == 200
        print("  Cancelled")
        
    else:
        print(f"  Failed to create reservation: {r.text}")

    # 7. Reports
    print("GET /reportes/salas-mas-reservadas")
    r = httpx.get(f"{BASE_URL}/reportes/salas-mas-reservadas")
    assert r.status_code == 200
    print("  OK")

    # 8. Sanctions
    print("POST /sanciones")
    sancion = {
        "ci_participante": "99999999",
        "fecha_inicio": date.today().isoformat(),
        "fecha_fin": (date.today() + timedelta(days=30)).isoformat()
    }
    r = httpx.post(f"{BASE_URL}/sanciones/", json=sancion)
    assert r.status_code == 201
    print("  Sanction created")

    print("Tests completed successfully!")

if __name__ == "__main__":
    test_endpoints()
