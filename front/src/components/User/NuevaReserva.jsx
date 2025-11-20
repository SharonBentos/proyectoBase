import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  obtenerSalas, 
  obtenerTurnos, 
  crearReserva,
  obtenerParticipantes 
} from '../../services/api';
import { getTodayString } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import './NuevaReserva.css';

const NuevaReserva = () => {
  const { user, canAccessSala } = useAuth();
  const navigate = useNavigate();

  const [salas, setSalas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  
  const [formData, setFormData] = useState({
    nombre_sala: '',
    edificio: '',
    fecha: getTodayString(),
    turnos_seleccionados: [],
    participantes_ci: []
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    // Agregar automáticamente al usuario actual como participante
    if (user?.ci && !formData.participantes_ci.includes(user.ci)) {
      setFormData(prev => ({
        ...prev,
        participantes_ci: [user.ci]
      }));
    }
  }, [user]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [salasData, turnosData, participantesData] = await Promise.all([
        obtenerSalas(),
        obtenerTurnos(),
        obtenerParticipantes()
      ]);

      // Filtrar salas según permisos del usuario
      const salasPermitidas = salasData.filter(sala => canAccessSala(sala.tipo_sala));
      
      setSalas(salasPermitidas);
      setTurnos(turnosData);
      setParticipantes(participantesData);
    } catch (error) {
      mostrarMensaje('error', 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSalaChange = (e) => {
    const [nombreSala, edificio] = e.target.value.split('|');
    const sala = salas.find(s => s.nombre_sala === nombreSala && s.edificio === edificio);
    
    setFormData(prev => ({
      ...prev,
      nombre_sala: nombreSala,
      edificio: edificio
    }));
    setSalaSeleccionada(sala);
  };

  const handleTurnoToggle = (idTurno) => {
    setFormData(prev => {
      const turnos = prev.turnos_seleccionados.includes(idTurno)
        ? prev.turnos_seleccionados.filter(t => t !== idTurno)
        : [...prev.turnos_seleccionados, idTurno].sort((a, b) => a - b);
      
      // Validar que sean máximo 2 turnos consecutivos
      if (turnos.length > 2) {
        mostrarMensaje('error', 'Solo puedes reservar hasta 2 horas consecutivas');
        return prev;
      }
      
      if (turnos.length === 2) {
        // Verificar que sean consecutivos
        const [turno1, turno2] = turnos;
        if (turno2 - turno1 !== 1) {
          mostrarMensaje('error', 'Los turnos deben ser consecutivos (2 horas seguidas)');
          return prev;
        }
      }
      
      return { ...prev, turnos_seleccionados: turnos };
    });
  };

  const handleParticipanteToggle = (ci) => {
    // No permitir eliminar al usuario actual
    if (ci === user?.ci) return;

    setFormData(prev => {
      const participantes = prev.participantes_ci.includes(ci)
        ? prev.participantes_ci.filter(p => p !== ci)
        : [...prev.participantes_ci, ci];
      
      return { ...prev, participantes_ci: participantes };
    });
  };

  const handleAgregarParticipante = () => {
    const email = emailInput.trim().toLowerCase();
    
    if (!email) {
      mostrarMensaje('error', 'Ingresa un email');
      return;
    }

    // Buscar el participante por email
    const participante = participantes.find(p => p.email.toLowerCase() === email);
    
    if (!participante) {
      mostrarMensaje('error', 'No se encontró un participante con ese email');
      return;
    }

    // Verificar si ya está agregado
    if (formData.participantes_ci.includes(participante.ci)) {
      mostrarMensaje('error', 'Este participante ya está agregado');
      return;
    }

    // Verificar capacidad de la sala
    if (salaSeleccionada && formData.participantes_ci.length >= salaSeleccionada.capacidad) {
      mostrarMensaje('error', `La sala tiene capacidad para ${salaSeleccionada.capacidad} personas`);
      return;
    }

    // Agregar participante
    setFormData(prev => ({
      ...prev,
      participantes_ci: [...prev.participantes_ci, participante.ci]
    }));
    
    setEmailInput('');
    mostrarMensaje('success', `${participante.nombre} ${participante.apellido} agregado`);
  };

  const handleRemoverParticipante = (ci) => {
    // No permitir eliminar al usuario actual
    if (ci === user?.ci) return;

    setFormData(prev => ({
      ...prev,
      participantes_ci: prev.participantes_ci.filter(p => p !== ci)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre_sala || !formData.edificio) {
      mostrarMensaje('error', 'Debes seleccionar una sala');
      return;
    }

    if (formData.turnos_seleccionados.length === 0) {
      mostrarMensaje('error', 'Debes seleccionar al menos un turno');
      return;
    }

    if (formData.participantes_ci.length === 0) {
      mostrarMensaje('error', 'Debes incluir al menos un participante');
      return;
    }

    if (salaSeleccionada && formData.participantes_ci.length > salaSeleccionada.capacidad) {
      mostrarMensaje('error', `La sala tiene capacidad para ${salaSeleccionada.capacidad} personas`);
      return;
    }

    try {
      setSubmitting(true);

      // Crear una reserva por cada turno seleccionado
      for (const idTurno of formData.turnos_seleccionados) {
        await crearReserva({
          nombre_sala: formData.nombre_sala,
          edificio: formData.edificio,
          fecha: formData.fecha,
          id_turno: idTurno,
          participantes_ci: formData.participantes_ci
        });
      }

      mostrarMensaje('success', 'Reserva(s) creada(s) correctamente');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/mis-reservas');
      }, 2000);

    } catch (error) {
      mostrarMensaje('error', error.message || 'Error al crear la reserva');
    } finally {
      setSubmitting(false);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner">Cargando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="nueva-reserva">
        <div className="page-header">
          <h1>Nueva Reserva</h1>
          <p>Completa el formulario para reservar una sala de estudio</p>
        </div>

        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reserva-form">
          {/* Selección de Sala */}
          <div className="form-section">
            <h2>📍 Seleccionar Sala</h2>
            <div className="form-group">
              <label>Sala *</label>
              <select
                value={formData.nombre_sala && formData.edificio ? `${formData.nombre_sala}|${formData.edificio}` : ''}
                onChange={handleSalaChange}
                required
                disabled={submitting}
              >
                <option value="">-- Selecciona una sala --</option>
                {salas.map(sala => (
                  <option 
                    key={`${sala.nombre_sala}-${sala.edificio}`}
                    value={`${sala.nombre_sala}|${sala.edificio}`}
                  >
                    {sala.nombre_sala} - {sala.edificio} (Cap: {sala.capacidad}) - {sala.tipo_sala}
                  </option>
                ))}
              </select>
            </div>

            {salaSeleccionada && (
              <div className="sala-info">
                <p><strong>Capacidad:</strong> {salaSeleccionada.capacidad} personas</p>
                <p><strong>Tipo:</strong> {salaSeleccionada.tipo_sala}</p>
              </div>
            )}
          </div>

          {/* Selección de Fecha y Turnos */}
          <div className="form-section">
            <h2>📅 Seleccionar Fecha y Horarios</h2>
            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                min={getTodayString()}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label>Turnos (bloques de 1 hora) *</label>
              <div className="turnos-grid">
                {turnos.map(turno => (
                  <label 
                    key={turno.id_turno} 
                    className={`turno-checkbox ${formData.turnos_seleccionados.includes(turno.id_turno) ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.turnos_seleccionados.includes(turno.id_turno)}
                      onChange={() => handleTurnoToggle(turno.id_turno)}
                      disabled={submitting}
                    />
                    <span>{turno.hora_inicio.substring(0, 5)} - {turno.hora_fin.substring(0, 5)}</span>
                  </label>
                ))}
              </div>
              <small className="help-text">
                Seleccionados: {formData.turnos_seleccionados.length} turno(s)
              </small>
            </div>
          </div>

          {/* Selección de Participantes */}
          <div className="form-section">
            <h2>👥 Seleccionar Participantes</h2>
            
            <div className="form-group">
              <label>Agregar participante por email</label>
              <div className="email-input-group">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAgregarParticipante())}
                  placeholder="ejemplo@uni.edu"
                  disabled={submitting}
                  className="email-input"
                />
                <button
                  type="button"
                  onClick={handleAgregarParticipante}
                  disabled={submitting}
                  className="btn-add"
                >
                  Agregar
                </button>
              </div>
              <small className="help-text">
                Ingresa el email del participante y presiona Enter o haz clic en Agregar
              </small>
            </div>

            <div className="form-group">
              <label>Participantes agregados ({formData.participantes_ci.length}
                {salaSeleccionada && ` / ${salaSeleccionada.capacidad} máximo`})
              </label>
              <div className="participantes-chips">
                {formData.participantes_ci.map(ci => {
                  const p = participantes.find(part => part.ci === ci);
                  if (!p) return null;
                  
                  return (
                    <div key={ci} className={`participante-chip ${ci === user?.ci ? 'current-user' : ''}`}>
                      <div className="participante-info">
                        <strong>{p.nombre} {p.apellido}</strong>
                        <small>{p.email}</small>
                      </div>
                      {ci === user?.ci ? (
                        <span className="badge-current">Tú</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoverParticipante(ci)}
                          disabled={submitting}
                          className="btn-remove"
                          title="Remover participante"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {formData.participantes_ci.length === 0 && (
                <p className="empty-state">No hay participantes agregados</p>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creando reserva...' : 'Crear Reserva'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NuevaReserva;
