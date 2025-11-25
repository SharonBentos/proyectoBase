import React, { useState, useEffect } from 'react';
import { obtenerMetricas } from '../../services/api';
import Layout from '../Layout/Layout';
import Card, { CardHeader, CardBody } from '../Common/Card';
import Loading from '../Common/Loading';
import Alert from '../Common/Alert';
import './AdminDashboard.css';

const MetricasList = ({ title, data }) => (
  <Card>
    <CardHeader>
      <h5>{title}</h5>
    </CardHeader>
    <CardBody>
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
          </li>
        ))}
      </ul>
    </CardBody>
  </Card>
);

const MetricasTable = ({ title, data, headers }) => (
    <Card>
        <CardHeader>
            <h5>{title}</h5>
        </CardHeader>
        <CardBody>
            <table className="table">
                <thead>
                    <tr>
                        {headers.map(h => <th key={h}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {headers.map(header => <td key={header}>{item[header.toLowerCase()]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </CardBody>
    </Card>
);


function PaginaMetricas() {
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        setLoading(true);
        const data = await obtenerMetricas();
        setMetricas(data);
      } catch (err) {
        setError('Error al cargar las métricas. ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, []);

  return (
    <Layout>
      <div className="admin-dashboard">
        <header className="dashboard-header">
          <h1>Métricas del sistema</h1>
          <p>Sistema de reportes para métricas especiales del sistema</p>
        </header>

        {loading && <Loading />}
        {error && <Alert message={error} type="error" />}

        {metricas && (
          <div className="metrics-grid">
            <MetricasTable title="Salas Más Reservadas" data={metricas.salasMasReservadas} headers={['Sala', 'Reservas']} />
            <MetricasTable title="Turnos Más Demandados" data={metricas.turnosMasDemandados} headers={['Turno', 'Reservas']} />
            <MetricasTable title="Promedio de Participantes por Sala" data={metricas.promedioParticipantesPorSala} headers={['Sala', 'Promedio']} />
            <MetricasList title="Reservas por Carrera y Facultad" data={metricas.reservasPorCarreraYFacultad} />
            <MetricasTable title="Porcentaje de Ocupación por Edificio" data={metricas.porcentajeOcupacionPorEdificio} headers={['Edificio', 'Porcentaje']} />
            <MetricasList title="Reservas y Asistencias por Rol" data={metricas.reservasAsistenciasPorRol} />
            <MetricasList title="Sanciones por Rol" data={metricas.sancionesPorRol} />
            <MetricasList title="Uso de Reservas" data={metricas.comparativaUso} />
            <MetricasList title="Uso de Salas por Tipo" data={metricas.usoSalasPorTipo} />
            <MetricasList title="Tasa de No-Asistencia por Carrera" data={metricas.tasaNoAsistenciaPorCarrera} />
            <MetricasList title="Distribución de Tamaño de Grupos" data={metricas.distribucionGrupos} />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default PaginaMetricas;
