-- ============================================================================
-- SCRIPT DE INSERCION DE DATOS DE PRUEBA
-- Datos de prueba con logica temporal
-- Fecha actual de referencia: 24 de noviembre de 2025
-- ============================================================================

-- Datos maestros: facultades
INSERT INTO facultad (id_facultad, nombre) VALUES
  (1, 'Ingenieria'),
  (2, 'Ciencias Sociales'),
  (3, 'Negocios'),
  (4, 'Humanidades');

-- Programas academicos
INSERT INTO programa_academico (nombre_programa, id_facultad, tipo) VALUES
  ('Ingenieria Informatica', 1, 'grado'),
  ('Ingenieria Electronica', 1, 'grado'),
  ('Telecomunicaciones',     1, 'grado'),
  ('Psicologia',             2, 'grado'),
  ('Comunicacion',           2, 'grado'),
  ('MBA',                    3, 'posgrado'),
  ('Data Science',           3, 'posgrado'),
  ('Educacion',              4, 'posgrado');

-- Participantes (alumnos y docentes)
INSERT INTO participante (ci, nombre, apellido, email) VALUES
  ('101', 'Ana',     'Perez',     'ana@uni.edu'),
  ('102', 'Bruno',   'Lopez',     'bruno@uni.edu'),
  ('103', 'Carla',   'Ruiz',      'carla@uni.edu'),
  ('104', 'Diego',   'Soto',      'diego@uni.edu'),
  ('105', 'Elena',   'Vidal',     'elena@uni.edu'),
  ('106', 'Fabio',   'Meza',      'fabio@uni.edu'),
  ('107', 'Gina',    'Nunez',     'gina@uni.edu'),
  ('108', 'Hugo',    'Torres',    'hugo@uni.edu'),
  ('109', 'Ivan',    'Silva',     'ivan@uni.edu'),
  ('110', 'Julia',   'Rossi',     'julia@uni.edu'),
  ('111', 'Kevin',   'Pereyra',   'kevin@uni.edu'),
  ('112', 'Laura',   'Bianchi',   'laura@uni.edu'),
  ('113', 'Marta',   'Gomez',     'marta@uni.edu'),     -- Docente
  ('114', 'Nico',    'Fernandez', 'nico@uni.edu'),     -- Docente
  ('115', 'Olga',    'Santos',    'olga@uni.edu'),     -- Posgrado
  ('116', 'Pablo',   'Da Costa',  'pablo@uni.edu'),    -- Posgrado (SANCIONADO)
  ('117', 'Quimey',  'Suarez',    'quimey@uni.edu'),   -- Posgrado
  ('118', 'Rocio',   'Martinez',  'rocio@uni.edu'),    -- Docente posgrado
  ('119', 'Sergio',  'Barrios',   'sergio@uni.edu'),   -- Docente posgrado
  ('120', 'Tania',   'Alonso',    'tania@uni.edu');    -- Docente posgrado

-- Login (contrasenas simples para desarrollo - p1, p2, p3, etc.)
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

-- Relacion participante-programa (define rol y tipo)
INSERT INTO participante_programa_academico (id_alumno_programa, ci_participante, nombre_programa, rol) VALUES
  (1,  '101', 'Ingenieria Informatica', 'alumno'),
  (2,  '102', 'Ingenieria Electronica', 'alumno'),
  (3,  '103', 'Psicologia',             'alumno'),
  (4,  '104', 'Telecomunicaciones',     'alumno'),
  (5,  '105', 'Ingenieria Informatica', 'alumno'),
  (6,  '106', 'Telecomunicaciones',     'alumno'),
  (7,  '107', 'Comunicacion',           'alumno'),
  (8,  '109', 'Psicologia',             'alumno'),
  (9,  '110', 'Ingenieria Informatica', 'alumno'),
  (10, '111', 'Ingenieria Electronica', 'alumno'),
  (11, '112', 'Comunicacion',           'alumno'),
  (12, '113', 'Ingenieria Informatica', 'docente'),  -- Docente de grado
  (13, '114', 'Ingenieria Electronica', 'docente'),  -- Docente de grado
  (14, '115', 'Data Science',           'alumno'),   -- Alumno posgrado
  (15, '116', 'MBA',                    'alumno'),   -- Alumno posgrado (SANCIONADO)
  (16, '117', 'Educacion',              'alumno'),   -- Alumno posgrado
  (17, '118', 'MBA',                    'docente'),  -- Docente posgrado
  (18, '119', 'Data Science',           'docente'),  -- Docente posgrado
  (19, '120', 'Educacion',              'docente');  -- Docente posgrado

-- Edificios
INSERT INTO edificio (nombre_edificio, direccion, departamento) VALUES
  ('Aulario Central', 'Av. Universitaria 1234', 'Montevideo'),
  ('Ingenieria',      'Av. Tech 2025',          'Montevideo'),
  ('Postgrados',      'Calle Posgrados 55',     'Montevideo'),
  ('Docencia',        'Av. Campus 77',          'Montevideo');

-- Salas (diferentes tipos para probar permisos)
INSERT INTO sala (nombre_sala, edificio, capacidad, tipo_sala) VALUES
  ('101',             'Aulario Central', 4, 'libre'),
  ('102',             'Aulario Central', 6, 'libre'),
  ('Cowork 1',        'Aulario Central', 6, 'libre'),
  ('Lab Redes',       'Ingenieria',      4, 'docente'),   -- Solo docentes
  ('Lab IoT',         'Ingenieria',      8, 'docente'),   -- Solo docentes
  ('Sala Estudio Ing','Ingenieria',      4, 'libre'),
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
-- RESERVAS CON LOGICA TEMPORAL (basadas en 24 Nov 2025)
-- ============================================================================

-- NOVIEMBRE (Mes actual - fechas 1-23 Nov = finalizadas, 24 Nov = hoy, 25-30 Nov = futuras)
INSERT INTO reserva (id_reserva, nombre_sala, edificio, fecha, id_turno, estado) VALUES
  -- Semana 1 de noviembre (finalizadas con asistencia)
  (3001,'101','Aulario Central','2025-11-04', 2,'finalizada'),      -- Ana + Bruno
  (3002,'102','Aulario Central','2025-11-04', 3,'finalizada'),      -- Carla + Diego
  (3003,'Cowork 1','Aulario Central','2025-11-05', 5,'finalizada'), -- Elena + Fabio + Gina
  (3004,'Sala Estudio Ing','Ingenieria','2025-11-05', 8,'finalizada'),  -- Julia + Kevin
  
  -- Semana 2 de noviembre (finalizadas, algunas sin asistencia)
  (3005,'Lab Redes','Ingenieria','2025-11-11', 9,'finalizada'),     -- Docente Marta
  (3006,'Lab IoT','Ingenieria','2025-11-11',10,'sin asistencia'),  -- Docente Nico (no asistio)
  (3007,'Posgrado 1','Postgrados','2025-11-12',11,'finalizada'),    -- Olga + Quimey (posgrado)
  (3008,'Posgrado 2','Postgrados','2025-11-12',13,'finalizada'),    -- Rocio (docente posgrado)
  
  -- Semana 3 de noviembre (finalizadas y canceladas)
  (3009,'101','Aulario Central','2025-11-18', 4,'finalizada'),      -- Bruno + Laura
  (3010,'102','Aulario Central','2025-11-18', 6,'cancelada'),       -- Ivan (cancelo)
  (3011,'Cowork 1','Aulario Central','2025-11-19', 7,'sin asistencia'), -- Diego + Elena (no asistieron)
  (3012,'Sala Docente 1','Docencia','2025-11-19', 1,'finalizada'),  -- Docente Marta
  
  -- Dias recientes (20-23 Nov - finalizadas)
  (3013,'Lab Redes','Ingenieria','2025-11-20',12,'finalizada'),     -- Docente Nico
  (3014,'Posgrado 1','Postgrados','2025-11-21',14,'finalizada'),    -- Sergio + Tania (docentes)
  (3015,'101','Aulario Central','2025-11-22', 5,'finalizada'),      -- Ana + Julia + Kevin
  (3016,'Sala Estudio Ing','Ingenieria','2025-11-23', 8,'finalizada'),  -- Fabio + Gina
  
  -- HOY 24 Nov (activas - deberian estar en curso)
  (3017,'102','Aulario Central','2025-11-24', 2,'activa'),          -- Carla + Laura (hoy 9-10am)
  (3018,'Cowork 1','Aulario Central','2025-11-24', 8,'activa'),     -- Bruno + Hugo (hoy 3-4pm)
  (3019,'Lab IoT','Ingenieria','2025-11-24',10,'activa'),          -- Docente Marta (hoy 5-6pm)
  (3020,'Posgrado 2','Postgrados','2025-11-24',12,'activa'),        -- Olga + Quimey (hoy 7-8pm)
  
  -- FUTURO (25-30 Nov - activas pendientes)
  (3021,'101','Aulario Central','2025-11-25', 3,'activa'),          -- Ana + Elena (manana)
  (3022,'Sala Estudio Ing','Ingenieria','2025-11-25', 7,'activa'),  -- Diego + Fabio
  (3023,'Lab Redes','Ingenieria','2025-11-26', 9,'activa'),         -- Docente Nico
  (3024,'Posgrado 1','Postgrados','2025-11-27',11,'activa'),        -- Rocio + Sergio
  (3025,'Cowork 1','Aulario Central','2025-11-28', 5,'activa'),     -- Gina + Hugo + Ivan
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
  ('113',3005,'2025-11-10 08:00:00',1), -- Docente asistio
  ('114',3006,'2025-11-10 09:00:00',0), -- Docente NO asistio
  ('115',3007,'2025-11-11 10:00:00',1), ('117',3007,'2025-11-11 10:01:00',1),
  ('118',3008,'2025-11-11 11:00:00',1),
  
  -- Noviembre semana 3
  ('102',3009,'2025-11-17 08:00:00',1), ('112',3009,'2025-11-17 08:01:00',1),
  ('109',3010,'2025-11-17 09:00:00',0), -- Cancelo
  ('104',3011,'2025-11-18 10:00:00',0), ('105',3011,'2025-11-18 10:01:00',0), -- No asistieron
  ('113',3012,'2025-11-18 11:00:00',1),
  
  -- Dias recientes
  ('114',3013,'2025-11-19 08:00:00',1),
  ('119',3014,'2025-11-20 09:00:00',1), ('120',3014,'2025-11-20 09:01:00',1),
  ('101',3015,'2025-11-21 08:00:00',1), ('110',3015,'2025-11-21 08:01:00',1), ('111',3015,'2025-11-21 08:02:00',1),
  ('106',3016,'2025-11-22 09:00:00',1), ('107',3016,'2025-11-22 09:01:00',1),
  
  -- HOY 24 Nov (asistencia aun no registrada = 0)
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
-- SANCIONES (con logica temporal)
-- ============================================================================
INSERT INTO sancion_participante (id_sancion, ci_participante, fecha_inicio, fecha_fin) VALUES
  -- Sancion ACTIVA - Pablo (CI 116) sancionado hasta 15 Dic por no asistir 3 veces
  (201,'116','2025-11-15','2025-12-15'),  -- No puede reservar hasta 15 Dic
  
  -- Sancion EXPIRADA - Nico (CI 114) sancionado en octubre, ya expiro
  (202,'114','2025-10-01','2025-10-31'),  -- Ya puede volver a reservar
  
  -- Sancion FUTURA - Hugo (CI 108) sera sancionado desde manana
  (203,'108','2025-11-25','2025-12-25');  -- Empieza manana

COMMIT;
