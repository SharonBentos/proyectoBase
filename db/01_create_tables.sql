-- ============================================================================
-- SCRIPT DE CREACIÓN DE TABLAS
-- Define la estructura completa de la base de datos
-- ============================================================================

CREATE TABLE participante (
    ci VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255),
    PRIMARY KEY (ci)
);

CREATE TABLE login (
    correo VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    es_administrador BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (correo)
);

CREATE TABLE facultad (
    id_facultad INT AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_facultad)
);

CREATE TABLE programa_academico (
    nombre_programa VARCHAR(100),
    id_facultad INT NOT NULL,
    tipo ENUM('grado','posgrado') NOT NULL,
    PRIMARY KEY (nombre_programa),
    FOREIGN KEY (id_facultad) REFERENCES facultad(id_facultad)
);

CREATE TABLE participante_programa_academico (
    id_alumno_programa INT AUTO_INCREMENT,
    ci_participante VARCHAR(20) NOT NULL,
    nombre_programa VARCHAR(100) NOT NULL,
    rol ENUM('alumno','docente') NOT NULL,
    PRIMARY KEY (id_alumno_programa),
    FOREIGN KEY (ci_participante) REFERENCES participante(ci),
    FOREIGN KEY (nombre_programa) REFERENCES programa_academico(nombre_programa)
);

CREATE TABLE edificio (
    nombre_edificio VARCHAR(100),
    direccion VARCHAR(120) NOT NULL,
    departamento VARCHAR(60) NOT NULL,
    PRIMARY KEY (nombre_edificio)
);

CREATE TABLE sala (
    nombre_sala VARCHAR(100),
    edificio VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    tipo_sala ENUM('libre','posgrado','docente') NOT NULL,
    PRIMARY KEY (nombre_sala, edificio),
    FOREIGN KEY (edificio) REFERENCES edificio(nombre_edificio)
);

CREATE TABLE turno (
    id_turno INT AUTO_INCREMENT,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    PRIMARY KEY (id_turno)
);

CREATE TABLE reserva (
    id_reserva INT AUTO_INCREMENT,
    nombre_sala VARCHAR(100) NOT NULL,
    edificio VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    id_turno INT NOT NULL,
    estado ENUM('activa','cancelada','sin asistencia','finalizada') NOT NULL DEFAULT 'activa',
    PRIMARY KEY (id_reserva),
    FOREIGN KEY (id_turno) REFERENCES turno(id_turno),
    FOREIGN KEY (nombre_sala, edificio) REFERENCES sala(nombre_sala, edificio)
);

CREATE TABLE reserva_participante (
    ci_participante VARCHAR(20),
    id_reserva INT,
    fecha_solicitud_reserva DATETIME NOT NULL,
    asistencia BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (ci_participante, id_reserva),
    FOREIGN KEY (ci_participante) REFERENCES participante(ci),
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva)
);

CREATE TABLE sancion_participante (
    id_sancion INT AUTO_INCREMENT,
    ci_participante VARCHAR(20) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    PRIMARY KEY (id_sancion),
    FOREIGN KEY (ci_participante) REFERENCES participante(ci)
);
