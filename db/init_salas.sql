CREATE DATABASE IF NOT EXISTS ucu_salas;
USE ucu_salas;

-- TABLA PARTICIPANTE
CREATE TABLE IF NOT EXISTS participante (
    ci VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255),
    PRIMARY KEY (ci)
);

-- TABLA LOGIN (adaptada para el backend actual)
CREATE TABLE IF NOT EXISTS login (
    correo VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    es_administrador BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (correo)
);

-- TABLA FACULTAD
CREATE TABLE IF NOT EXISTS facultad (
    id_facultad INT AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_facultad)
);

-- TABLA PROGRAMA ACADEMICO
CREATE TABLE IF NOT EXISTS programa_academico (
    nombre_programa VARCHAR(100),
    id_facultad INT NOT NULL,
    tipo ENUM('grado','posgrado') NOT NULL,
    PRIMARY KEY (nombre_programa),
    FOREIGN KEY (id_facultad) REFERENCES facultad(id_facultad)
);

-- TABLA RELACION PARTICIPANTE-PROGRAMA
CREATE TABLE IF NOT EXISTS participante_programa_academico (
    id_alumno_programa INT AUTO_INCREMENT,
    ci_participante VARCHAR(20) NOT NULL,
    nombre_programa VARCHAR(100) NOT NULL,
    rol ENUM('alumno','docente') NOT NULL,
    PRIMARY KEY (id_alumno_programa),
    FOREIGN KEY (ci_participante) REFERENCES participante(ci),
    FOREIGN KEY (nombre_programa) REFERENCES programa_academico(nombre_programa)
);

-- TABLA EDIFICIO
CREATE TABLE IF NOT EXISTS edificio (
    nombre_edificio VARCHAR(100),
    direccion VARCHAR(120) NOT NULL,
    departamento VARCHAR(60) NOT NULL,
    PRIMARY KEY (nombre_edificio)
);

-- TABLA SALA
CREATE TABLE IF NOT EXISTS sala (
    nombre_sala VARCHAR(100),
    edificio VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    tipo_sala ENUM('libre','posgrado','docente') NOT NULL,
    PRIMARY KEY (nombre_sala, edificio),
    FOREIGN KEY (edificio) REFERENCES edificio(nombre_edificio)
);

-- TABLA TURNO (bloques horarios de 1 hora entre 08:00 y 23:00)
CREATE TABLE IF NOT EXISTS turno (
    id_turno INT AUTO_INCREMENT,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    PRIMARY KEY (id_turno)
);

-- TABLA RESERVA
CREATE TABLE IF NOT EXISTS reserva (
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

-- TABLA RESERVA_PARTICIPANTE
CREATE TABLE IF NOT EXISTS reserva_participante (
    ci_participante VARCHAR(20),
    id_reserva INT,
    fecha_solicitud_reserva DATETIME NOT NULL,
    asistencia BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (ci_participante, id_reserva),
    FOREIGN KEY (ci_participante) REFERENCES participante(ci),
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva)
);

-- TABLA SANCION_PARTICIPANTE
CREATE TABLE IF NOT EXISTS sancion_participante (
    id_sancion INT AUTO_INCREMENT,
    ci_participante VARCHAR(20) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    PRIMARY KEY (id_sancion),
    FOREIGN KEY (ci_participante) REFERENCES participante(ci)
);

-- Relacionar login con participante (correo -> participante.email)
-- ALTER TABLE login
-- ADD CONSTRAINT fk_login_participante
-- FOREIGN KEY (correo) REFERENCES participante(email);

-- ============================================================================
-- DATOS DE PRUEBA CON LÓGICA TEMPORAL
-- Fecha actual de referencia: 24 de noviembre de 2025
-- ============================================================================

-- Datos maestros: facultades
INSERT INTO facultad (id_facultad, nombre) VALUES
  (1, 'Ingeniería'),
  (2, 'Ciencias Sociales'),
  (3, 'Negocios'),
  (4, 'Humanidades');

-- Programas académicos
INSERT INTO programa_academico (nombre_programa, id_facultad, tipo) VALUES
  ('Ingeniería Informática', 1, 'grado'),
  ('Ingeniería Electrónica', 1, 'grado'),
  ('Telecomunicaciones',     1, 'grado'),
  ('Psicología',             2, 'grado'),
  ('Comunicación',           2, 'grado'),
  ('MBA',                    3, 'posgrado'),
  ('Data Science',           3, 'posgrado'),
  ('Educación',              4, 'posgrado');

-- Participantes (alumnos y docentes)
INSERT INTO participante (ci, nombre, apellido, email) VALUES
  ('101', 'Ana',     'Pérez',     'ana@uni.edu'),
  ('102', 'Bruno',   'López',     'bruno@uni.edu'),
  ('103', 'Carla',   'Ruiz',      'carla@uni.edu'),
  ('104', 'Diego',   'Soto',      'diego@uni.edu'),
  ('105', 'Elena',   'Vidal',     'elena@uni.edu'),
  ('106', 'Fabio',   'Meza',      'fabio@uni.edu'),
  ('107', 'Gina',    'Núñez',     'gina@uni.edu'),
  ('108', 'Hugo',    'Torres',    'hugo@uni.edu'),
  ('109', 'Iván',    'Silva',     'ivan@uni.edu'),
  ('110', 'Julia',   'Rossi',     'julia@uni.edu'),
  ('111', 'Kevin',   'Pereyra',   'kevin@uni.edu'),
  ('112', 'Laura',   'Bianchi',   'laura@uni.edu'),
  ('113', 'Marta',   'Gómez',     'marta@uni.edu'),     -- Docente
  ('114', 'Nico',    'Fernández', 'nico@uni.edu'),     -- Docente
  ('115', 'Olga',    'Santos',    'olga@uni.edu'),     -- Posgrado
  ('116', 'Pablo',   'Da Costa',  'pablo@uni.edu'),    -- Posgrado (SANCIONADO)
  ('117', 'Quimey',  'Suárez',    'quimey@uni.edu'),   -- Posgrado
  ('118', 'Rocío',   'Martínez',  'rocio@uni.edu'),    -- Docente posgrado
  ('119', 'Sergio',  'Barrios',   'sergio@uni.edu'),   -- Docente posgrado
  ('120', 'Tania',   'Alonso',    'tania@uni.edu');    -- Docente posgrado

-- Login (contraseñas simples para desarrollo - p1, p2, p3, etc.)
INSERT INTO login (correo, password, es_administrador) VALUES
  ('ana@uni.edu','p1', 0),
  ('bruno@uni.edu','p2', 0),
  ('carla@uni.edu','p3', 0),
  ('diego@uni.edu','p4', 0),
  ('elena@uni.edu','p5', 0),
  ('fabio@uni.edu','p6', 0),
  ('gina@uni.edu','p7', 0),
  ('hugo@uni.edu','p8', 0),
  ('ivan@uni.edu','p9', 0),
  ('julia@uni.edu','p10', 0),
  ('kevin@uni.edu','p11', 0),
  ('laura@uni.edu','p12', 0),
  ('marta@uni.edu','p13',0),
  ('nico@uni.edu','p14',0),
  ('olga@uni.edu','p15',0),
  ('pablo@uni.edu','p16',0),
  ('quimey@uni.edu','p17',0),
  ('rocio@uni.edu','p18',0),
  ('sergio@uni.edu','p19',0),
  ('tania@uni.edu','p20',0),
  ('admin@uni.edu','admin123',1);  -- Usuario administrador

-- Relación participante-programa (define rol y tipo)
INSERT INTO participante_programa_academico (id_alumno_programa, ci_participante, nombre_programa, rol) VALUES
  (1,  '101', 'Ingeniería Informática', 'alumno'),
  (2,  '102', 'Ingeniería Electrónica', 'alumno'),
  (3,  '103', 'Psicología',             'alumno'),
  (4,  '104', 'Telecomunicaciones',     'alumno'),
  (5,  '105', 'Ingeniería Informática', 'alumno'),
  (6,  '106', 'Telecomunicaciones',     'alumno'),
  (7,  '107', 'Comunicación',           'alumno'),
  (8,  '109', 'Psicología',             'alumno'),
  (9,  '110', 'Ingeniería Informática', 'alumno'),
  (10, '111', 'Ingeniería Electrónica', 'alumno'),
  (11, '112', 'Comunicación',           'alumno'),
  (12, '113', 'Ingeniería Informática', 'docente'),  -- Docente de grado
  (13, '114', 'Ingeniería Electrónica', 'docente'),  -- Docente de grado
  (14, '115', 'Data Science',           'alumno'),   -- Alumno posgrado
  (15, '116', 'MBA',                    'alumno'),   -- Alumno posgrado (SANCIONADO)
  (16, '117', 'Educación',              'alumno'),   -- Alumno posgrado
  (17, '118', 'MBA',                    'docente'),  -- Docente posgrado
  (18, '119', 'Data Science',           'docente'),  -- Docente posgrado
  (19, '120', 'Educación',              'docente');  -- Docente posgrado

-- Edificios
INSERT INTO edificio (nombre_edificio, direccion, departamento) VALUES
  ('Aulario Central', 'Av. Universitaria 1234', 'Montevideo'),
  ('Ingeniería',      'Av. Tech 2025',          'Montevideo'),
  ('Postgrados',      'Calle Posgrados 55',     'Montevideo'),
  ('Docencia',        'Av. Campus 77',          'Montevideo');

-- Salas (diferentes tipos para probar permisos)
INSERT INTO sala (nombre_sala, edificio, capacidad, tipo_sala) VALUES
  ('101',             'Aulario Central', 4, 'libre'),
  ('102',             'Aulario Central', 6, 'libre'),
  ('Cowork 1',        'Aulario Central', 6, 'libre'),
  ('Lab Redes',       'Ingeniería',      4, 'docente'),   -- Solo docentes
  ('Lab IoT',         'Ingeniería',      8, 'docente'),   -- Solo docentes
  ('Sala Estudio Ing','Ingeniería',      4, 'libre'),
  ('Posgrado 1',      'Postgrados',      5, 'posgrado'),  -- Posgrado y docentes
  ('Posgrado 2',      'Postgrados',      3, 'posgrado'),  -- Posgrado y docentes
  ('Sala Docente 1',  'Docencia',        5, 'docente'),   -- Solo docentes
  ('Sala Docente 2',  'Docencia',        4, 'docente');   -- Solo docentes

-- Turnos (08:00 - 23:00 en bloques de 1 hora)
INSERT INTO turno (id_turno, hora_inicio, hora_fin) VALUES
  (1,'08:00:00','09:00:00'),(2,'09:00:00','10:00:00'),(3,'10:00:00','11:00:00'),
  (4,'11:00:00','12:00:00'),(5,'12:00:00','13:00:00'),(6,'13:00:00','14:00:00'),
  (7,'14:00:00','15:00:00'),(8,'15:00:00','16:00:00'),(9,'16:00:00','17:00:00'),
  (10,'17:00:00','18:00:00'),(11,'18:00:00','19:00:00'),(12,'19:00:00','20:00:00'),
  (13,'20:00:00','21:00:00'),(14,'21:00:00','22:00:00'),(15,'22:00:00','23:00:00');

-- ============================================================================
-- RESERVAS CON LÓGICA TEMPORAL (basadas en 24 Nov 2025)
-- ============================================================================

-- NOVIEMBRE (Mes actual - fechas 1-23 Nov = finalizadas, 24 Nov = hoy, 25-30 Nov = futuras)
INSERT INTO reserva (id_reserva, nombre_sala, edificio, fecha, id_turno, estado) VALUES
  -- Semana 1 de noviembre (finalizadas con asistencia)
  (3001,'101','Aulario Central','2025-11-04', 2,'finalizada'),      -- Ana + Bruno
  (3002,'102','Aulario Central','2025-11-04', 3,'finalizada'),      -- Carla + Diego
  (3003,'Cowork 1','Aulario Central','2025-11-05', 5,'finalizada'), -- Elena + Fabio + Gina
  (3004,'Sala Estudio Ing','Ingeniería','2025-11-05', 8,'finalizada'),  -- Julia + Kevin
  
  -- Semana 2 de noviembre (finalizadas, algunas sin asistencia)
  (3005,'Lab Redes','Ingeniería','2025-11-11', 9,'finalizada'),     -- Docente Marta
  (3006,'Lab IoT','Ingeniería','2025-11-11',10,'sin asistencia'),  -- Docente Nico (no asistió)
  (3007,'Posgrado 1','Postgrados','2025-11-12',11,'finalizada'),    -- Olga + Quimey (posgrado)
  (3008,'Posgrado 2','Postgrados','2025-11-12',13,'finalizada'),    -- Rocío (docente posgrado)
  
  -- Semana 3 de noviembre (finalizadas y canceladas)
  (3009,'101','Aulario Central','2025-11-18', 4,'finalizada'),      -- Bruno + Laura
  (3010,'102','Aulario Central','2025-11-18', 6,'cancelada'),       -- Iván (canceló)
  (3011,'Cowork 1','Aulario Central','2025-11-19', 7,'sin asistencia'), -- Diego + Elena (no asistieron)
  (3012,'Sala Docente 1','Docencia','2025-11-19', 1,'finalizada'),  -- Docente Marta
  
  -- Días recientes (20-23 Nov - finalizadas)
  (3013,'Lab Redes','Ingeniería','2025-11-20',12,'finalizada'),     -- Docente Nico
  (3014,'Posgrado 1','Postgrados','2025-11-21',14,'finalizada'),    -- Sergio + Tania (docentes)
  (3015,'101','Aulario Central','2025-11-22', 5,'finalizada'),      -- Ana + Julia + Kevin
  (3016,'Sala Estudio Ing','Ingeniería','2025-11-23', 8,'finalizada'),  -- Fabio + Gina
  
  -- HOY 24 Nov (activas - deberían estar en curso)
  (3017,'102','Aulario Central','2025-11-24', 2,'activa'),          -- Carla + Laura (hoy 9-10am)
  (3018,'Cowork 1','Aulario Central','2025-11-24', 8,'activa'),     -- Bruno + Hugo (hoy 3-4pm)
  (3019,'Lab IoT','Ingeniería','2025-11-24',10,'activa'),          -- Docente Marta (hoy 5-6pm)
  (3020,'Posgrado 2','Postgrados','2025-11-24',12,'activa'),        -- Olga + Quimey (hoy 7-8pm)
  
  -- FUTURO (25-30 Nov - activas pendientes)
  (3021,'101','Aulario Central','2025-11-25', 3,'activa'),          -- Ana + Elena (mañana)
  (3022,'Sala Estudio Ing','Ingeniería','2025-11-25', 7,'activa'),  -- Diego + Fabio
  (3023,'Lab Redes','Ingeniería','2025-11-26', 9,'activa'),         -- Docente Nico
  (3024,'Posgrado 1','Postgrados','2025-11-27',11,'activa'),        -- Rocío + Sergio
  (3025,'Cowork 1','Aulario Central','2025-11-28', 5,'activa'),     -- Gina + Hugo + Iván
  (3026,'102','Aulario Central','2025-11-29', 4,'activa'),          -- Julia + Kevin + Laura
  (3027,'Sala Docente 2','Docencia','2025-11-30', 2,'activa');      -- Docente Tania

-- Participantes en reservas (asistencias coherentes con estados)
INSERT INTO reserva_participante (ci_participante, id_reserva, fecha_solicitud_reserva, asistencia) VALUES
  -- Noviembre semana 1 (todas finalizadas con asistencia)
  ('101',3001,'2025-11-03 10:00:00',1), ('102',3001,'2025-11-03 10:01:00',1),
  ('103',3002,'2025-11-03 11:00:00',1), ('104',3002,'2025-11-03 11:01:00',1),
  ('105',3003,'2025-11-04 09:00:00',1), ('106',3003,'2025-11-04 09:01:00',1), ('107',3003,'2025-11-04 09:02:00',1),
  ('110',3004,'2025-11-04 12:00:00',1), ('111',3004,'2025-11-04 12:01:00',1),
  
  -- Noviembre semana 2
  ('113',3005,'2025-11-10 08:00:00',1), -- Docente asistió
  ('114',3006,'2025-11-10 09:00:00',0), -- Docente NO asistió
  ('115',3007,'2025-11-11 10:00:00',1), ('117',3007,'2025-11-11 10:01:00',1),
  ('118',3008,'2025-11-11 11:00:00',1),
  
  -- Noviembre semana 3
  ('102',3009,'2025-11-17 08:00:00',1), ('112',3009,'2025-11-17 08:01:00',1),
  ('109',3010,'2025-11-17 09:00:00',0), -- Canceló
  ('104',3011,'2025-11-18 10:00:00',0), ('105',3011,'2025-11-18 10:01:00',0), -- No asistieron
  ('113',3012,'2025-11-18 11:00:00',1),
  
  -- Días recientes
  ('114',3013,'2025-11-19 08:00:00',1),
  ('119',3014,'2025-11-20 09:00:00',1), ('120',3014,'2025-11-20 09:01:00',1),
  ('101',3015,'2025-11-21 08:00:00',1), ('110',3015,'2025-11-21 08:01:00',1), ('111',3015,'2025-11-21 08:02:00',1),
  ('106',3016,'2025-11-22 09:00:00',1), ('107',3016,'2025-11-22 09:01:00',1),
  
  -- HOY 24 Nov (asistencia aún no registrada = 0)
  ('103',3017,'2025-11-23 10:00:00',0), ('112',3017,'2025-11-23 10:01:00',0),
  ('102',3018,'2025-11-23 11:00:00',0), ('108',3018,'2025-11-23 11:01:00',0),
  ('113',3019,'2025-11-23 12:00:00',0),
  ('115',3020,'2025-11-23 13:00:00',0), ('117',3020,'2025-11-23 13:01:00',0),
  
  -- FUTURO (asistencia pendiente)
  ('101',3021,'2025-11-24 08:00:00',0), ('105',3021,'2025-11-24 08:01:00',0),
  ('104',3022,'2025-11-24 09:00:00',0), ('106',3022,'2025-11-24 09:01:00',0),
  ('114',3023,'2025-11-24 10:00:00',0),
  ('118',3024,'2025-11-24 11:00:00',0), ('119',3024,'2025-11-24 11:01:00',0),
  ('107',3025,'2025-11-24 12:00:00',0), ('108',3025,'2025-11-24 12:01:00',0), ('109',3025,'2025-11-24 12:02:00',0),
  ('110',3026,'2025-11-24 13:00:00',0), ('111',3026,'2025-11-24 13:01:00',0), ('112',3026,'2025-11-24 13:02:00',0),
  ('120',3027,'2025-11-24 14:00:00',0);

-- ============================================================================
-- SANCIONES (con lógica temporal)
-- ============================================================================
INSERT INTO sancion_participante (id_sancion, ci_participante, fecha_inicio, fecha_fin) VALUES
  -- Sanción ACTIVA - Pablo (CI 116) sancionado hasta 15 Dic por no asistir 3 veces
  (201,'116','2025-11-15','2025-12-15'),  -- No puede reservar hasta 15 Dic
  
  -- Sanción EXPIRADA - Nico (CI 114) sancionado en octubre, ya expiró
  (202,'114','2025-10-01','2025-10-31'),  -- Ya puede volver a reservar
  
  -- Sanción FUTURA - Hugo (CI 108) será sancionado desde mañana
  (203,'108','2025-11-25','2025-12-25');  -- Empieza mañana

COMMIT;

