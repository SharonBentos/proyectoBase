CREATE DATABASE IF NOT EXISTS ucu_salas;
USE ucu_salas;

-- TABLA PARTICIPANTE
CREATE TABLE IF NOT EXISTS participante (
    ci VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
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
ALTER TABLE login
ADD CONSTRAINT fk_login_participante
FOREIGN KEY (correo) REFERENCES participante(email);


-- Datos maestros: facultades
INSERT INTO facultad (id_facultad, nombre) VALUES
  (1, 'Ingeniería'),
  (2, 'Ciencias Sociales'),
  (3, 'Negocios'),
  (4, 'Humanidades');

-- Programas
INSERT INTO programa_academico (nombre_programa, id_facultad, tipo) VALUES
  ('Ingeniería Informática', 1, 'grado'),
  ('Ingeniería Electrónica', 1, 'grado'),
  ('Telecomunicaciones',     1, 'grado'),
  ('Psicología',             2, 'grado'),
  ('Comunicación',           2, 'grado'),
  ('MBA',                    3, 'posgrado'),
  ('Data Science',           3, 'posgrado'),
  ('Educación',              4, 'posgrado');

-- Participantes de ejemplo
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
  ('113', 'Marta',   'Gómez',     'marta@uni.edu'),
  ('114', 'Nico',    'Fernández', 'nico@uni.edu'),
  ('115', 'Olga',    'Santos',    'olga@uni.edu'),
  ('116', 'Pablo',   'Da Costa',  'pablo@uni.edu'),
  ('117', 'Quimey',  'Suárez',    'quimey@uni.edu'),
  ('118', 'Rocío',   'Martínez',  'rocio@uni.edu'),
  ('119', 'Sergio',  'Barrios',   'sergio@uni.edu'),
  ('120', 'Tania',   'Alonso',    'tania@uni.edu');

-- Login (contraseñas de ejemplo; se recomienda hashear en producción)
INSERT INTO login (correo, password, es_administrador) VALUES
  ('ana@uni.edu','p1', 0),('bruno@uni.edu','p2', 0),('carla@uni.edu','p3', 0),('diego@uni.edu','p4', 0),
  ('elena@uni.edu','p5', 0),('fabio@uni.edu','p6', 0),('gina@uni.edu','p7', 0),('hugo@uni.edu','p8', 0),
  ('ivan@uni.edu','p9', 0),('julia@uni.edu','p10', 0),('kevin@uni.edu','p11', 0),('laura@uni.edu','p12', 0),
  ('marta@uni.edu','p13',0),('nico@uni.edu','p14',0),('olga@uni.edu','p15',0),('pablo@uni.edu','p16',0),
  ('quimey@uni.edu','p17',0),('rocio@uni.edu','p18',0),('sergio@uni.edu','p19',0),('tania@uni.edu','p20',0);

-- Participante-programa (ejemplos)
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
  (12, '113', 'Ingeniería Informática', 'docente'),
  (13, '114', 'Ingeniería Electrónica', 'docente'),
  (14, '115', 'Data Science',           'alumno'),
  (15, '116', 'MBA',                    'alumno'),
  (16, '117', 'Educación',              'alumno'),
  (17, '118', 'MBA',                    'docente'),
  (18, '119', 'Data Science',           'docente'),
  (19, '120', 'Educación',              'docente');


-- Edificios
INSERT INTO edificio (nombre_edificio, direccion, departamento) VALUES
  ('Aulario Central', 'Av. Universitaria 1234', 'Montevideo'),
  ('Ingeniería',      'Av. Tech 2025',          'Montevideo'),
  ('Postgrados',      'Calle Posgrados 55',     'Montevideo'),
  ('Docencia',        'Av. Campus 77',          'Montevideo');

-- Salas
INSERT INTO sala (nombre_sala, edificio, capacidad, tipo_sala) VALUES
  ('101',             'Aulario Central', 40, 'libre'),
  ('102',             'Aulario Central', 30, 'libre'),
  ('Cowork 1',        'Aulario Central', 16, 'libre'),
  ('Lab Redes',       'Ingeniería',      20, 'docente'),
  ('Lab IoT',         'Ingeniería',      18, 'docente'),
  ('Sala Estudio Ing','Ingeniería',      24, 'libre'),
  ('Posgrado 1',      'Postgrados',      25, 'posgrado'),
  ('Posgrado 2',      'Postgrados',      20, 'posgrado'),
  ('Sala Docente 1',  'Docencia',        15, 'docente'),
  ('Sala Docente 2',  'Docencia',        12, 'docente');

-- Turnos (08:00 - 23:00 en bloques de 1 hora)
INSERT INTO turno (id_turno, hora_inicio, hora_fin) VALUES
  (1,'08:00:00','09:00:00'),(2,'09:00:00','10:00:00'),(3,'10:00:00','11:00:00'),
  (4,'11:00:00','12:00:00'),(5,'12:00:00','13:00:00'),(6,'13:00:00','14:00:00'),
  (7,'14:00:00','15:00:00'),(8,'15:00:00','16:00:00'),(9,'16:00:00','17:00:00'),
  (10,'17:00:00','18:00:00'),(11,'18:00:00','19:00:00'),(12,'19:00:00','20:00:00'),
  (13,'20:00:00','21:00:00'),(14,'21:00:00','22:00:00'),(15,'22:00:00','23:00:00');

-- Reservas de ejemplo (varios estados)
INSERT INTO reserva (id_reserva, nombre_sala, edificio, fecha, id_turno, estado) VALUES
  (2001,'101','Aulario Central','2025-10-01', 1,'finalizada'),
  (2002,'101','Aulario Central','2025-10-01', 2,'finalizada'),
  (2003,'102','Aulario Central','2025-10-02', 3,'cancelada'),
  (2004,'102','Aulario Central','2025-10-02', 4,'finalizada'),
  (2005,'Cowork 1','Aulario Central','2025-10-03', 5,'sin asistencia'),
  (2006,'Cowork 1','Aulario Central','2025-10-03', 6,'finalizada'),
  (2007,'Sala Estudio Ing','Ingeniería','2025-10-04', 7,'finalizada'),
  (2008,'Sala Estudio Ing','Ingeniería','2025-10-04', 8,'activa'),
  (2009,'Lab Redes','Ingeniería','2025-10-05', 9,'finalizada'),
  (2010,'Lab IoT','Ingeniería','2025-10-05',10,'finalizada'),
  (2011,'Lab Redes','Ingeniería','2025-10-06',11,'cancelada'),
  (2012,'Lab IoT','Ingeniería','2025-10-06',12,'finalizada'),
  (2013,'Posgrado 1','Postgrados','2025-10-07',13,'finalizada'),
  (2014,'Posgrado 1','Postgrados','2025-10-07',14,'sin asistencia'),
  (2015,'Posgrado 2','Postgrados','2025-10-08',15,'finalizada'),
  (2016,'Posgrado 2','Postgrados','2025-10-08',12,'finalizada'),
  (2017,'Sala Docente 1','Docencia','2025-10-09', 1,'finalizada'),
  (2018,'Sala Docente 1','Docencia','2025-10-09', 2,'finalizada'),
  (2019,'Sala Docente 2','Docencia','2025-10-10', 3,'finalizada'),
  (2020,'Sala Docente 2','Docencia','2025-10-10', 4,'cancelada'),
  (2021,'101','Aulario Central','2025-10-11', 5,'finalizada'),
  (2022,'102','Aulario Central','2025-10-11', 6,'activa'),
  (2023,'Cowork 1','Aulario Central','2025-10-12', 7,'finalizada'),
  (2024,'Sala Estudio Ing','Ingeniería','2025-10-12', 8,'finalizada'),
  (2025,'Lab Redes','Ingeniería','2025-10-13', 9,'sin asistencia'),
  (2026,'Lab IoT','Ingeniería','2025-10-13',10,'finalizada'),
  (2027,'Posgrado 1','Postgrados','2025-10-14',11,'finalizada'),
  (2028,'Posgrado 2','Postgrados','2025-10-14',12,'cancelada'),
  (2029,'Sala Docente 1','Docencia','2025-10-15',13,'finalizada'),
  (2030,'Sala Docente 2','Docencia','2025-10-16',14,'finalizada');

-- Reserva participante (asistencias de ejemplo)
INSERT INTO reserva_participante (ci_participante, id_reserva, fecha_solicitud_reserva, asistencia) VALUES
  ('101',2001,'2025-09-28 09:00:00',1), ('105',2001,'2025-09-28 09:01:00',1), ('110',2001,'2025-09-28 09:02:00',1),
  ('101',2002,'2025-09-28 09:05:00',1), ('102',2002,'2025-09-28 09:06:00',1), ('112',2002,'2025-09-28 09:07:00',0),
  ('109',2003,'2025-09-29 10:00:00',0),
  ('107',2004,'2025-09-29 10:30:00',1), ('110',2004,'2025-09-29 10:31:00',1),
  ('101',2005,'2025-09-30 12:15:00',0), ('102',2005,'2025-09-30 12:16:00',0),
  ('103',2006,'2025-09-30 12:20:00',1), ('104',2006,'2025-09-30 12:21:00',1), ('105',2006,'2025-09-30 12:22:00',1),
  ('105',2007,'2025-10-01 13:10:00',1), ('106',2007,'2025-10-01 13:11:00',1), ('111',2007,'2025-10-01 13:12:00',1),
  ('101',2008,'2025-10-01 14:10:00',0), ('112',2008,'2025-10-01 14:11:00',0),
  ('113',2009,'2025-10-02 15:00:00',1), ('114',2009,'2025-10-02 15:01:00',1),
  ('113',2010,'2025-10-02 16:00:00',1), ('114',2010,'2025-10-02 16:01:00',1), ('118',2010,'2025-10-02 16:02:00',1),
  ('114',2011,'2025-10-03 17:00:00',0),
  ('113',2012,'2025-10-03 18:00:00',1), ('118',2012,'2025-10-03 18:01:00',1),
  ('116',2013,'2025-10-04 19:00:00',1), ('115',2013,'2025-10-04 19:01:00',1), ('118',2013,'2025-10-04 19:02:00',1),
  ('116',2014,'2025-10-04 20:00:00',0), ('115',2014,'2025-10-04 20:01:00',0),
  ('115',2015,'2025-10-05 22:00:00',1), ('119',2015,'2025-10-05 22:01:00',1),
  ('117',2016,'2025-10-05 19:00:00',1), ('120',2016,'2025-10-05 19:01:00',1),
  ('118',2017,'2025-10-06 08:00:00',1), ('119',2017,'2025-10-06 08:01:00',1),
  ('118',2018,'2025-10-06 09:00:00',1), ('120',2018,'2025-10-06 09:01:00',1),
  ('113',2019,'2025-10-07 10:00:00',1), ('114',2019,'2025-10-07 10:01:00',1),
  ('113',2020,'2025-10-07 11:00:00',0),
  ('101',2021,'2025-10-08 12:00:00',1), ('102',2021,'2025-10-08 12:01:00',1), ('110',2021,'2025-10-08 12:02:00',1),
  ('109',2022,'2025-10-08 13:00:00',0),
  ('104',2023,'2025-10-09 14:00:00',1), ('105',2023,'2025-10-09 14:01:00',1), ('111',2023,'2025-10-09 14:02:00',1),
  ('106',2024,'2025-10-09 15:00:00',1), ('112',2024,'2025-10-09 15:01:00',1),
  ('113',2025,'2025-10-10 16:00:00',0), ('118',2025,'2025-10-10 16:01:00',0),
  ('114',2026,'2025-10-10 17:00:00',1), ('119',2026,'2025-10-10 17:01:00',1),
  ('115',2027,'2025-10-11 18:00:00',1), ('118',2027,'2025-10-11 18:01:00',1),
  ('116',2028,'2025-10-11 19:00:00',0),
  ('118',2029,'2025-10-12 20:00:00',1), ('119',2029,'2025-10-12 20:01:00',1), ('120',2029,'2025-10-12 20:02:00',1),
  ('113',2030,'2025-10-13 21:00:00',1), ('114',2030,'2025-10-13 21:01:00',1);

-- Sanciones de ejemplo
INSERT INTO sancion_participante (id_sancion, ci_participante, fecha_inicio, fecha_fin) VALUES
  (101,'101','2025-09-01','2025-09-30'),
  (102,'116','2025-10-12','2025-12-12'),
  (103,'118','2025-08-20','2025-08-31');

COMMIT;

