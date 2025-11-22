-- MySQL dump 10.13  Distrib 9.5.0, for Linux (x86_64)
--
-- Host: localhost    Database: basesi
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b231a359-c720-11f0-9af6-7ad63004dc86:1-108';

--
-- Table structure for table `edificio`
--

DROP TABLE IF EXISTS `edificio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `edificio` (
  `nombre_edificio` varchar(100) NOT NULL,
  `direccion` varchar(120) NOT NULL,
  `departamento` varchar(60) NOT NULL,
  PRIMARY KEY (`nombre_edificio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edificio`
--

LOCK TABLES `edificio` WRITE;
/*!40000 ALTER TABLE `edificio` DISABLE KEYS */;
INSERT INTO `edificio` VALUES ('Aulario Central','Av. Universitaria 1234','Montevideo'),('Docencia','Av. Campus 77','Montevideo'),('Ingeniería','Av. Tech 2025','Montevideo'),('Postgrados','Calle Posgrados 55','Montevideo');
/*!40000 ALTER TABLE `edificio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facultad`
--

DROP TABLE IF EXISTS `facultad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facultad` (
  `id_facultad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_facultad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facultad`
--

LOCK TABLES `facultad` WRITE;
/*!40000 ALTER TABLE `facultad` DISABLE KEYS */;
INSERT INTO `facultad` VALUES (1,'Ingeniería'),(2,'Ciencias Sociales'),(3,'Negocios'),(4,'Humanidades');
/*!40000 ALTER TABLE `facultad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `correo` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `es_administrador` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES ('ana@uni.edu','p1',0),('bruno@uni.edu','p2',0),('carla@uni.edu','p3',0),('diego@uni.edu','p4',0),('elena@uni.edu','p5',0),('fabio@uni.edu','p6',0),('gina@uni.edu','p7',0),('hugo@uni.edu','p8',0),('ivan@uni.edu','p9',0),('julia@uni.edu','p10',0),('kevin@uni.edu','p11',0),('laura@uni.edu','p12',0),('marta@uni.edu','p13',0),('nico@uni.edu','p14',0),('olga@uni.edu','p15',0),('pablo@uni.edu','p16',0),('quimey@uni.edu','p17',0),('rocio@uni.edu','p18',0),('sergio@uni.edu','p19',0),('tania@uni.edu','p20',0);
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participante`
--

DROP TABLE IF EXISTS `participante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participante` (
  `ci` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ci`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participante`
--

LOCK TABLES `participante` WRITE;
/*!40000 ALTER TABLE `participante` DISABLE KEYS */;
INSERT INTO `participante` VALUES ('101','Ana','Pérez','ana@uni.edu',NULL),('102','Bruno','López','bruno@uni.edu',NULL),('103','Carla','Ruiz','carla@uni.edu',NULL),('104','Diego','Soto','diego@uni.edu',NULL),('105','Elena','Vidal','elena@uni.edu',NULL),('106','Fabio','Meza','fabio@uni.edu',NULL),('107','Gina','Núñez','gina@uni.edu',NULL),('108','Hugo','Torres','hugo@uni.edu',NULL),('109','Iván','Silva','ivan@uni.edu',NULL),('110','Julia','Rossi','julia@uni.edu',NULL),('111','Kevin','Pereyra','kevin@uni.edu',NULL),('112','Laura','Bianchi','laura@uni.edu',NULL),('113','Marta','Gómez','marta@uni.edu',NULL),('114','Nico','Fernández','nico@uni.edu',NULL),('115','Olga','Santos','olga@uni.edu',NULL),('116','Pablo','Da Costa','pablo@uni.edu',NULL),('117','Quimey','Suárez','quimey@uni.edu',NULL),('118','Rocío','Martínez','rocio@uni.edu',NULL),('119','Sergio','Barrios','sergio@uni.edu',NULL),('120','Tania','Alonso','tania@uni.edu',NULL);
/*!40000 ALTER TABLE `participante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participante_programa_academico`
--

DROP TABLE IF EXISTS `participante_programa_academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participante_programa_academico` (
  `id_alumno_programa` int NOT NULL AUTO_INCREMENT,
  `ci_participante` varchar(20) NOT NULL,
  `nombre_programa` varchar(100) NOT NULL,
  `rol` enum('alumno','docente') NOT NULL,
  PRIMARY KEY (`id_alumno_programa`),
  KEY `ci_participante` (`ci_participante`),
  KEY `nombre_programa` (`nombre_programa`),
  CONSTRAINT `participante_programa_academico_ibfk_1` FOREIGN KEY (`ci_participante`) REFERENCES `participante` (`ci`),
  CONSTRAINT `participante_programa_academico_ibfk_2` FOREIGN KEY (`nombre_programa`) REFERENCES `programa_academico` (`nombre_programa`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participante_programa_academico`
--

LOCK TABLES `participante_programa_academico` WRITE;
/*!40000 ALTER TABLE `participante_programa_academico` DISABLE KEYS */;
INSERT INTO `participante_programa_academico` VALUES (1,'101','Ingeniería Informática','alumno'),(2,'102','Ingeniería Electrónica','alumno'),(3,'103','Psicología','alumno'),(4,'104','Telecomunicaciones','alumno'),(5,'105','Ingeniería Informática','alumno'),(6,'106','Telecomunicaciones','alumno'),(7,'107','Comunicación','alumno'),(8,'109','Psicología','alumno'),(9,'110','Ingeniería Informática','alumno'),(10,'111','Ingeniería Electrónica','alumno'),(11,'112','Comunicación','alumno'),(12,'113','Ingeniería Informática','docente'),(13,'114','Ingeniería Electrónica','docente'),(14,'115','Data Science','alumno'),(15,'116','MBA','alumno'),(16,'117','Educación','alumno'),(17,'118','MBA','docente'),(18,'119','Data Science','docente'),(19,'120','Educación','docente');
/*!40000 ALTER TABLE `participante_programa_academico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programa_academico`
--

DROP TABLE IF EXISTS `programa_academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programa_academico` (
  `nombre_programa` varchar(100) NOT NULL,
  `id_facultad` int NOT NULL,
  `tipo` enum('grado','posgrado') NOT NULL,
  PRIMARY KEY (`nombre_programa`),
  KEY `id_facultad` (`id_facultad`),
  CONSTRAINT `programa_academico_ibfk_1` FOREIGN KEY (`id_facultad`) REFERENCES `facultad` (`id_facultad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programa_academico`
--

LOCK TABLES `programa_academico` WRITE;
/*!40000 ALTER TABLE `programa_academico` DISABLE KEYS */;
INSERT INTO `programa_academico` VALUES ('Comunicación',2,'grado'),('Data Science',3,'posgrado'),('Educación',4,'posgrado'),('Ingeniería Electrónica',1,'grado'),('Ingeniería Informática',1,'grado'),('MBA',3,'posgrado'),('Psicología',2,'grado'),('Telecomunicaciones',1,'grado');
/*!40000 ALTER TABLE `programa_academico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `nombre_sala` varchar(100) NOT NULL,
  `edificio` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `id_turno` int NOT NULL,
  `estado` enum('activa','cancelada','sin asistencia','finalizada') NOT NULL DEFAULT 'activa',
  PRIMARY KEY (`id_reserva`),
  KEY `id_turno` (`id_turno`),
  KEY `nombre_sala` (`nombre_sala`,`edificio`),
  CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turno` (`id_turno`),
  CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`nombre_sala`, `edificio`) REFERENCES `sala` (`nombre_sala`, `edificio`)
) ENGINE=InnoDB AUTO_INCREMENT=2035 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (2001,'101','Aulario Central','2025-10-01',1,'finalizada'),(2002,'101','Aulario Central','2025-10-01',2,'finalizada'),(2003,'102','Aulario Central','2025-10-02',3,'cancelada'),(2004,'102','Aulario Central','2025-10-02',4,'finalizada'),(2005,'Cowork 1','Aulario Central','2025-10-03',5,'sin asistencia'),(2006,'Cowork 1','Aulario Central','2025-10-03',6,'finalizada'),(2007,'Sala Estudio Ing','Ingeniería','2025-10-04',7,'finalizada'),(2008,'Sala Estudio Ing','Ingeniería','2025-10-04',8,'activa'),(2009,'Lab Redes','Ingeniería','2025-10-05',9,'finalizada'),(2010,'Lab IoT','Ingeniería','2025-10-05',10,'finalizada'),(2011,'Lab Redes','Ingeniería','2025-10-06',11,'cancelada'),(2012,'Lab IoT','Ingeniería','2025-10-06',12,'finalizada'),(2013,'Posgrado 1','Postgrados','2025-10-07',13,'finalizada'),(2014,'Posgrado 1','Postgrados','2025-10-07',14,'sin asistencia'),(2015,'Posgrado 2','Postgrados','2025-10-08',15,'finalizada'),(2016,'Posgrado 2','Postgrados','2025-10-08',12,'finalizada'),(2017,'Sala Docente 1','Docencia','2025-10-09',1,'finalizada'),(2018,'Sala Docente 1','Docencia','2025-10-09',2,'finalizada'),(2019,'Sala Docente 2','Docencia','2025-10-10',3,'finalizada'),(2020,'Sala Docente 2','Docencia','2025-10-10',4,'cancelada'),(2021,'101','Aulario Central','2025-10-11',5,'finalizada'),(2022,'102','Aulario Central','2025-10-11',6,'activa'),(2023,'Cowork 1','Aulario Central','2025-10-12',7,'finalizada'),(2024,'Sala Estudio Ing','Ingeniería','2025-10-12',8,'finalizada'),(2025,'Lab Redes','Ingeniería','2025-10-13',9,'sin asistencia'),(2026,'Lab IoT','Ingeniería','2025-10-13',10,'finalizada'),(2027,'Posgrado 1','Postgrados','2025-10-14',11,'finalizada'),(2028,'Posgrado 2','Postgrados','2025-10-14',12,'cancelada'),(2029,'Sala Docente 1','Docencia','2025-10-15',13,'finalizada'),(2030,'Sala Docente 2','Docencia','2025-10-16',14,'finalizada'),(2031,'101','Aulario Central','2025-11-24',1,'activa'),(2032,'101','Aulario Central','2025-11-24',2,'cancelada'),(2033,'Cowork 1','Aulario Central','2025-11-25',12,'activa'),(2034,'Cowork 1','Aulario Central','2025-11-25',13,'activa');
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva_participante`
--

DROP TABLE IF EXISTS `reserva_participante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva_participante` (
  `ci_participante` varchar(20) NOT NULL,
  `id_reserva` int NOT NULL,
  `fecha_solicitud_reserva` datetime NOT NULL,
  `asistencia` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ci_participante`,`id_reserva`),
  KEY `id_reserva` (`id_reserva`),
  CONSTRAINT `reserva_participante_ibfk_1` FOREIGN KEY (`ci_participante`) REFERENCES `participante` (`ci`),
  CONSTRAINT `reserva_participante_ibfk_2` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva_participante`
--

LOCK TABLES `reserva_participante` WRITE;
/*!40000 ALTER TABLE `reserva_participante` DISABLE KEYS */;
INSERT INTO `reserva_participante` VALUES ('101',2001,'2025-09-28 09:00:00',1),('101',2002,'2025-09-28 09:05:00',1),('101',2005,'2025-09-30 12:15:00',0),('101',2008,'2025-10-01 14:10:00',0),('101',2021,'2025-10-08 12:00:00',1),('102',2002,'2025-09-28 09:06:00',1),('102',2005,'2025-09-30 12:16:00',0),('102',2021,'2025-10-08 12:01:00',1),('102',2031,'2025-11-22 00:23:27',0),('102',2032,'2025-11-22 00:23:27',0),('102',2033,'2025-11-22 00:24:54',0),('102',2034,'2025-11-22 00:24:54',0),('103',2006,'2025-09-30 12:20:00',1),('104',2006,'2025-09-30 12:21:00',1),('104',2023,'2025-10-09 14:00:00',1),('105',2001,'2025-09-28 09:01:00',1),('105',2006,'2025-09-30 12:22:00',1),('105',2007,'2025-10-01 13:10:00',1),('105',2023,'2025-10-09 14:01:00',1),('106',2007,'2025-10-01 13:11:00',1),('106',2024,'2025-10-09 15:00:00',1),('107',2004,'2025-09-29 10:30:00',1),('109',2003,'2025-09-29 10:00:00',0),('109',2022,'2025-10-08 13:00:00',0),('110',2001,'2025-09-28 09:02:00',1),('110',2004,'2025-09-29 10:31:00',1),('110',2021,'2025-10-08 12:02:00',1),('111',2007,'2025-10-01 13:12:00',1),('111',2023,'2025-10-09 14:02:00',1),('112',2002,'2025-09-28 09:07:00',0),('112',2008,'2025-10-01 14:11:00',0),('112',2024,'2025-10-09 15:01:00',1),('113',2009,'2025-10-02 15:00:00',1),('113',2010,'2025-10-02 16:00:00',1),('113',2012,'2025-10-03 18:00:00',1),('113',2019,'2025-10-07 10:00:00',1),('113',2020,'2025-10-07 11:00:00',0),('113',2025,'2025-10-10 16:00:00',0),('113',2030,'2025-10-13 21:00:00',1),('114',2009,'2025-10-02 15:01:00',1),('114',2010,'2025-10-02 16:01:00',1),('114',2011,'2025-10-03 17:00:00',0),('114',2019,'2025-10-07 10:01:00',1),('114',2026,'2025-10-10 17:00:00',1),('114',2030,'2025-10-13 21:01:00',1),('114',2031,'2025-11-22 00:23:27',0),('114',2032,'2025-11-22 00:23:27',0),('115',2013,'2025-10-04 19:01:00',1),('115',2014,'2025-10-04 20:01:00',0),('115',2015,'2025-10-05 22:00:00',1),('115',2027,'2025-10-11 18:00:00',1),('116',2013,'2025-10-04 19:00:00',1),('116',2014,'2025-10-04 20:00:00',0),('116',2028,'2025-10-11 19:00:00',0),('117',2016,'2025-10-05 19:00:00',1),('118',2010,'2025-10-02 16:02:00',1),('118',2012,'2025-10-03 18:01:00',1),('118',2013,'2025-10-04 19:02:00',1),('118',2017,'2025-10-06 08:00:00',1),('118',2018,'2025-10-06 09:00:00',1),('118',2025,'2025-10-10 16:01:00',0),('118',2027,'2025-10-11 18:01:00',1),('118',2029,'2025-10-12 20:00:00',1),('119',2015,'2025-10-05 22:01:00',1),('119',2017,'2025-10-06 08:01:00',1),('119',2026,'2025-10-10 17:01:00',1),('119',2029,'2025-10-12 20:01:00',1),('120',2016,'2025-10-05 19:01:00',1),('120',2018,'2025-10-06 09:01:00',1),('120',2029,'2025-10-12 20:02:00',1);
/*!40000 ALTER TABLE `reserva_participante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala`
--

DROP TABLE IF EXISTS `sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala` (
  `nombre_sala` varchar(100) NOT NULL,
  `edificio` varchar(100) NOT NULL,
  `capacidad` int NOT NULL,
  `tipo_sala` enum('libre','posgrado','docente') NOT NULL,
  PRIMARY KEY (`nombre_sala`,`edificio`),
  KEY `edificio` (`edificio`),
  CONSTRAINT `sala_ibfk_1` FOREIGN KEY (`edificio`) REFERENCES `edificio` (`nombre_edificio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala`
--

LOCK TABLES `sala` WRITE;
/*!40000 ALTER TABLE `sala` DISABLE KEYS */;
INSERT INTO `sala` VALUES ('101','Aulario Central',40,'libre'),('102','Aulario Central',30,'libre'),('Cowork 1','Aulario Central',16,'libre'),('Lab IoT','Ingeniería',18,'docente'),('Lab Redes','Ingeniería',20,'docente'),('Posgrado 1','Postgrados',25,'posgrado'),('Posgrado 2','Postgrados',20,'posgrado'),('Sala Docente 1','Docencia',15,'docente'),('Sala Docente 2','Docencia',12,'docente'),('Sala Estudio Ing','Ingeniería',24,'libre');
/*!40000 ALTER TABLE `sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sancion_participante`
--

DROP TABLE IF EXISTS `sancion_participante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sancion_participante` (
  `id_sancion` int NOT NULL AUTO_INCREMENT,
  `ci_participante` varchar(20) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  PRIMARY KEY (`id_sancion`),
  KEY `ci_participante` (`ci_participante`),
  CONSTRAINT `sancion_participante_ibfk_1` FOREIGN KEY (`ci_participante`) REFERENCES `participante` (`ci`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sancion_participante`
--

LOCK TABLES `sancion_participante` WRITE;
/*!40000 ALTER TABLE `sancion_participante` DISABLE KEYS */;
INSERT INTO `sancion_participante` VALUES (101,'101','2025-09-01','2025-09-30'),(102,'116','2025-10-12','2025-12-12'),(103,'118','2025-08-20','2025-08-31');
/*!40000 ALTER TABLE `sancion_participante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turno`
--

DROP TABLE IF EXISTS `turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turno` (
  `id_turno` int NOT NULL AUTO_INCREMENT,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (`id_turno`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turno`
--

LOCK TABLES `turno` WRITE;
/*!40000 ALTER TABLE `turno` DISABLE KEYS */;
INSERT INTO `turno` VALUES (1,'08:00:00','09:00:00'),(2,'09:00:00','10:00:00'),(3,'10:00:00','11:00:00'),(4,'11:00:00','12:00:00'),(5,'12:00:00','13:00:00'),(6,'13:00:00','14:00:00'),(7,'14:00:00','15:00:00'),(8,'15:00:00','16:00:00'),(9,'16:00:00','17:00:00'),(10,'17:00:00','18:00:00'),(11,'18:00:00','19:00:00'),(12,'19:00:00','20:00:00'),(13,'20:00:00','21:00:00'),(14,'21:00:00','22:00:00'),(15,'22:00:00','23:00:00');
/*!40000 ALTER TABLE `turno` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-22  1:51:16
