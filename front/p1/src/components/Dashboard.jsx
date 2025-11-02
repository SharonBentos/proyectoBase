import { useEffect, useState } from 'react';

const API = 'http://localhost:3003/reservas';
const USUARIO_FALLBACK = 'sharon';

export default function Dashboard({ usuarioLogueado }) {
  // estado del usuario; inicializamos a null para forzar lectura en useEffect
  const [usuarioActual, setUsuarioActual] = useState(null);

  const [salones, setSalones] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
  const [integrantes, setIntegrantes] = useState([]);
  const [misReservas, setMisReservas] = useState([]);
  const [todasLasReservas, setTodasLasReservas] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [fechaReserva, setFechaReserva] = useState(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // 1) sincronizar usuario: prioridad prop -> localStorage -> fallback
  useEffect(() => {
    // primera fuente: prop que viene del login (si existe)
    if (usuarioLogueado) {
      setUsuarioActual(usuarioLogueado);
      console.debug('[Dashboard] usuario tomado desde prop:', usuarioLogueado);
      return;
    }

    // segunda fuente: localStorage (clave 'usuario' por convención)
    try {
      const fromStorage = localStorage.getItem('usuario') || localStorage.getItem('usuarioActual');
      if (fromStorage) {
        setUsuarioActual(fromStorage);
        console.debug('[Dashboard] usuario tomado desde localStorage:', fromStorage);
        return;
      }
    } catch (e) {
      console.debug('[Dashboard] error leyendo localStorage:', e);
    }

    // fallback (solo para evitar romper la UX en tests)
    setUsuarioActual(USUARIO_FALLBACK);
    console.debug('[Dashboard] usuario fallback usado:', USUARIO_FALLBACK);
  }, [usuarioLogueado]);

  // cargar salones (archivo local)
  useEffect(() => {
    fetch('/salones.json')
      .then(res => res.json())
      .then(data => setSalones(data || []))
      .catch(() => setSalones([]));
  }, []);

  // helper: cargar reservas y filtrar por usuarioActual
  const cargarReservas = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        const arr = data || [];
        setTodasLasReservas(arr);
        if (usuarioActual) {
          setMisReservas(arr.filter(r => r.usuario === usuarioActual));
        } else {
          setMisReservas([]);
        }
      })
      .catch(() => {
        setTodasLasReservas([]);
        setMisReservas([]);
      });
  };

  // recargar reservas cuando usuarioActual esté disponible
  useEffect(() => {
    if (usuarioActual) {
      cargarReservas();
      if (seleccionado) setIntegrantes([{ nombre: usuarioActual, usuario: usuarioActual }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioActual]);

  // utilitarios
  const getWeekKey = dateStr => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000);
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${weekNumber}`;
  };

  const guardarReserva = nueva => {
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva)
    })
      .then(res => res.json())
      .then(creada => {
        setTodasLasReservas(prev => [...prev, creada]);
        if (creada.usuario === usuarioActual) setMisReservas(prev => [...prev, creada]);
        return creada;
      });
  };

  const handleAgregarIntegrante = () => {
    if (!nuevoNombre.trim()) return;
    if (!seleccionado) {
      alert('Primero elegí un salón');
      return;
    }
    if (integrantes.length >= seleccionado.capacidad) {
      alert(`Máximo ${seleccionado.capacidad} integrantes`);
      return;
    }
    const usuario = nuevoNombre.trim().toLowerCase();
    setIntegrantes(prev => [...prev, { nombre: nuevoNombre.trim(), usuario }]);
    setNuevoNombre('');
  };

  const handleEliminarIntegrante = index => {
    const item = integrantes[index];
    if (!item) return;
    if (item.usuario === usuarioActual) {
      alert('No podés eliminarte de tu propia reserva');
      return;
    }
    setIntegrantes(prev => {
      const copia = [...prev];
      copia.splice(index, 1);
      return copia;
    });
  };

  const handleReservar = async () => {
    if (!usuarioActual) {
      alert('No hay usuario logueado. Volvé a iniciar sesión.');
      return;
    }
    if (!seleccionado || horariosSeleccionados.length === 0) {
      alert('Seleccioná un salón y al menos un horario');
      return;
    }
    if (integrantes.length === 0) {
      alert('Agregá al menos un integrante');
      return;
    }
    if (!fechaReserva) {
      alert('Seleccioná una fecha para la reserva');
      return;
    }

    const semanaActual = getWeekKey(fechaReserva);
    const reservasSemana = todasLasReservas.filter(
      r => r.usuario === usuarioActual && getWeekKey(r.fecha) === semanaActual
    );
    if (reservasSemana.length >= 3) {
      alert('Ya tenés 3 reservas esta semana. Podés reservar la próxima.');
      return;
    }

    const hayConflicto = todasLasReservas.some(r =>
      r.salon === seleccionado.nombre &&
      r.fecha === fechaReserva &&
      r.horarios.some(h => horariosSeleccionados.includes(h))
    );
    if (hayConflicto) {
      alert('Ya existe una reserva para ese salón y horario en esa fecha');
      return;
    }

    let integrantesFinal = integrantes.slice();
    if (!integrantesFinal.some(i => i.usuario === usuarioActual)) {
      integrantesFinal = [{ nombre: usuarioActual, usuario: usuarioActual }, ...integrantesFinal];
    }

    const nuevaReserva = {
      usuario: usuarioActual,
      salon: seleccionado.nombre,
      edificio: seleccionado.edificio,
      horarios: horariosSeleccionados,
      integrantes: integrantesFinal,
      fecha: fechaReserva
    };

    try {
      await guardarReserva(nuevaReserva);
      setHorariosSeleccionados([]);
      setIntegrantes([{ nombre: usuarioActual, usuario: usuarioActual }]);
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const dd = String(hoy.getDate()).padStart(2, '0');
      setFechaReserva(`${yyyy}-${mm}-${dd}`);
      alert('Reserva confirmada');
    } catch {
      alert('Error al crear la reserva. Revisá el servidor.');
    }
  };

  const eliminarReserva = id => {
    const confirmar = window.confirm('¿Querés eliminar esta reserva?');
    if (!confirmar) return;

    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo eliminar');
        cargarReservas();
      })
      .catch(() => {
        alert('Error al eliminar la reserva en el servidor. Intentá recargar la página.');
      });
  };

  const onSeleccionarSalon = e => {
    const id = parseInt(e.target.value);
    const salon = salones.find(s => s.id === id) || null;
    setSeleccionado(salon);
    setHorariosSeleccionados([]);
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    setFechaReserva(`${yyyy}-${mm}-${dd}`);
    if (usuarioActual) setIntegrantes([{ nombre: usuarioActual, usuario: usuarioActual }]);
  };

  // DEBUG - deja estos logs hasta que confirmes que ya aparece Axel correctamente
  console.debug('[Dashboard] usuarioActual (render):', usuarioActual);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Bienvenida al sistema de reservas</h2>

      <div style={{ marginBottom: 12 }}>
        <strong>Usuario:</strong> {usuarioActual ?? 'Sin sesión'}
      </div>

      <p>Seleccioná un salón, fecha y horarios disponibles para realizar tu reserva:</p>

      <label>Salón:</label>
      <select onChange={onSeleccionarSalon}>
        <option value="">-- Elegí un salón --</option>
        {salones.map(salon => (
          <option key={salon.id} value={salon.id}>
            {salon.nombre} ({salon.edificio} - {salon.tipo})
          </option>
        ))}
      </select>

      {seleccionado && (
        <>
          <br /><br />
          <label>Fecha:</label>
          <input
            type="date"
            value={fechaReserva}
            onChange={e => setFechaReserva(e.target.value)}
            style={{ marginBottom: '1rem', display: 'block' }}
          />

          <label>Horarios:</label>
          <select
            multiple
            size="6"
            value={horariosSeleccionados}
            onChange={e => {
              const opciones = Array.from(e.target.selectedOptions).map(opt => opt.value);
              setHorariosSeleccionados(opciones);
            }}
            style={{ display: 'block', marginBottom: 12 }}
          >
            {seleccionado.horarios.map((h, i) => (
              <option key={i} value={h}>{h}</option>
            ))}
          </select>

          <label>Integrantes (máx. {seleccionado.capacidad}):</label>
          <div style={{ marginBottom: 12 }}>
            {integrantes.map((persona, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                {persona.nombre} <button onClick={() => handleEliminarIntegrante(i)}>🗑️</button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Nombre del integrante"
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <button onClick={handleAgregarIntegrante}>Agregar Integrante</button>
          </div>

          <button onClick={handleReservar}>Reservar</button>
        </>
      )}

      {misReservas.length > 0 && (
        <>
          <hr />
          <h3>Mis Reservas</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Edificio</th>
                <th>Salón</th>
                <th>Fecha</th>
                <th>Horarios</th>
                <th>Integrantes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {misReservas.map(reserva => (
                <tr key={reserva.id}>
                  <td>{reserva.edificio}</td>
                  <td>{reserva.salon}</td>
                  <td>{new Date(`${reserva.fecha}T00:00:00`).toLocaleDateString()}</td>
                  <td>{Array.isArray(reserva.horarios) ? reserva.horarios.join(', ') : String(reserva.horarios)}</td>
                  <td>{Array.isArray(reserva.integrantes) ? reserva.integrantes.map(i => i.nombre).join(', ') : String(reserva.integrantes)}</td>
                  <td>
                    <button onClick={() => eliminarReserva(reserva.id)}>🗑️ Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}