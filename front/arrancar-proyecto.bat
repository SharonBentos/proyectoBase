start cmd.exe /k "cd C:\Users\user\Desktop\UCU\AAA BASE DE DATOS I\PROYECTO\proyectoBase\front && npx json-server --watch db.json --port 3001"
start cmd.exe /k "cd C:\Users\user\Desktop\UCU\AAA BASE DE DATOS I\PROYECTO\proyectoBase\front && npx json-server --watch reservas.json --port 3003"
start cmd.exe /k "cd C:\Users\user\Desktop\UCU\AAA BASE DE DATOS I\PROYECTO\proyectoBase\front\public && npx json-server --watch salones.json --port 3000"
start cmd.exe /k "cd C:\Users\user\Desktop\UCU\AAA BASE DE DATOS I\PROYECTO\proyectoBase\front && && npm run dev"
timeout /t 5 /nobreak > nul
start "" "http://localhost:5173"
