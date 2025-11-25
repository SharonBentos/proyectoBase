import React, { useState, useEffect } from "react";
import { obtenerMetricas } from "../../services/api";
import Layout from "../Layout/Layout";
import Card, { CardHeader, CardBody } from "../Common/Card";
import Loading from "../Common/Loading";
import Alert from "../Common/Alert";
import "./AdminDashboard.css";

const MetricasList = ({ title, data, formatter }) => {
  const displayData = formatter ? formatter(data) : data;

  return (
    <Card>
      <CardHeader>
        <h5>{title}</h5>
      </CardHeader>
      <CardBody>
        <ul>
          {Object.entries(displayData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object" ? JSON.stringify(value) : value}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};

const MetricasTable = ({ title, data, headers }) => (
  <Card>
    <CardHeader>
      <h5>{title}</h5>
    </CardHeader>
    <CardBody>
      <table className="table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{item[header.toLowerCase()]}</td>
              ))}
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
        setError("Error al cargar las métricas. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, []);

  // Formatters
  const formatSeconds = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 5);
  };

  const formatSalasMasReservadas = (data) =>
    data.map((item) => ({
      ...item,
      sala: `${item.nombre_sala} (${item.edificio})`,
    }));

  const formatTurnosMasDemandados = (data) =>
    data.map((item) => ({
      ...item,
      turno: `${formatSeconds(item.hora_inicio)} - ${formatSeconds(item.hora_fin)}`,
    }));

  const formatPromedioParticipantesPorSala = (data) =>
    data.map((item) => ({
      ...item,
      sala: `${item.nombre_sala} (${item.edificio})`,
    }));

  const formatReservasPorCarreraYFacultad = (data) =>
    data.map((item) => ({
      carrera: `${item.nombre_programa} (${item.facultad})`,
      reservas: item.cantidad_reservas,
    }));

  const formatPorcentajeOcupacionPorEdificio = (data) =>
    data.map((item) => ({
      ...item,
      porcentaje: `${item.porcentaje.toFixed(2)}%`,
    }));

  const formatReservasAsistenciasPorRol = (data) => {
    const formattedData = [];
    const keyMappings = {
      alumnos_grado: "Alumnos de Grado",
      alumnos_posgrado: "Alumnos de Posgrado",
      profesores: "Profesores",
    };
    for (const key in data) {
      const readableKey = keyMappings[key] || key;
      const value = data[key];
      formattedData.push({
        rol: readableKey,
        reservas: value.reservas,
        asistencias: value.asistencias,
      });
    }
    return formattedData;
  };

  const formatSancionesPorRol = (data) => {
    const formattedData = [];
    const keyMappings = {
      alumnos_grado: "Alumnos de Grado",
      alumnos_posgrado: "Alumnos de Posgrado",
      profesores: "Profesores",
    };
    for (const key in data) {
      const readableKey = keyMappings[key] || key;
      formattedData.push({
        rol: readableKey,
        sanciones: data[key],
      });
    }
    return formattedData;
  };

  const formatComparativaUso = (data) => {
    const readableData = {};
    const keyMappings = {
      efectivas: "Efectivas",
      canceladas: "Canceladas",
      noAsistidas: "No Asistidas",
    };
    for (const key in data) {
      const readableKey = keyMappings[key] || key;
      readableData[readableKey] = `${data[key].toFixed(2)}%`;
    }
    return readableData;
  };

  const formatUsoSalasPorTipo = (data) => {
    const readableData = {};
    const keyMappings = {
      libre: "Uso libre",
      posgrado: "Exclusiva de posgrado",
      docente: "Exclusiva de docentes",
    };
    for (const key in data) {
      const readableKey = keyMappings[key] || key;
      readableData[readableKey] = data[key];
    }
    return readableData;
  };

  const formatTasaNoAsistenciaPorCarrera = (data) => {
    const readableData = {};
    for (const key in data) {
      readableData[key] = `${data[key].toFixed(2)}%`;
    }
    return readableData;
  };

  const formatDistribucionGrupos = (data) => {
    const readableData = {};
    for (const key in data) {
      const label = key === "1" ? "1 participante" : `${key} participantes`;
      readableData[label] = data[key];
    }
    return readableData;
  };

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
            <MetricasTable
              title="Salas Más Reservadas"
              data={formatSalasMasReservadas(metricas.salasMasReservadas)}
              headers={["Sala", "Reservas"]}
            />
            <MetricasTable
              title="Turnos Más Demandados"
              data={formatTurnosMasDemandados(metricas.turnosMasDemandados)}
              headers={["Turno", "Reservas"]}
            />
            <MetricasTable
              title="Promedio de Participantes por Sala"
              data={formatPromedioParticipantesPorSala(
                metricas.promedioParticipantesPorSala,
              )}
              headers={["Sala", "Promedio"]}
            />
            <MetricasTable
              title="Reservas por Carrera y Facultad"
              data={formatReservasPorCarreraYFacultad(
                metricas.reservasPorCarreraYFacultad,
              )}
              headers={["Carrera", "Reservas"]}
            />
            <MetricasTable
              title="Porcentaje de Ocupación por Edificio"
              data={formatPorcentajeOcupacionPorEdificio(
                metricas.porcentajeOcupacionPorEdificio,
              )}
              headers={["Edificio", "Porcentaje"]}
            />
            <MetricasTable
              title="Reservas y Asistencias por Rol"
              data={formatReservasAsistenciasPorRol(
                metricas.reservasAsistenciasPorRol,
              )}
              headers={["Rol", "Reservas", "Asistencias"]}
            />
            <MetricasTable
              title="Sanciones por Rol"
              data={formatSancionesPorRol(metricas.sancionesPorRol)}
              headers={["Rol", "Sanciones"]}
            />
            <MetricasList
              title="Uso de Reservas"
              data={metricas.comparativaUso}
              formatter={formatComparativaUso}
            />
            <MetricasList
              title="Uso de Salas por Tipo"
              data={metricas.usoSalasPorTipo}
              formatter={formatUsoSalasPorTipo}
            />
            <MetricasList
              title="Tasa de No-Asistencia por Carrera"
              data={metricas.tasaNoAsistenciaPorCarrera}
              formatter={formatTasaNoAsistenciaPorCarrera}
            />
            <MetricasList
              title="Distribución de Tamaño de Grupos"
              data={metricas.distribucionGrupos}
              formatter={formatDistribucionGrupos}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default PaginaMetricas;
