-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN: RECREAR BASE DE DATOS DESDE CERO
-- Este script elimina la base de datos existente y la crea nuevamente
-- ============================================================================

-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS ucu_salas;

-- Crear la base de datos nuevamente
CREATE DATABASE ucu_salas;

-- Seleccionar la base de datos
USE ucu_salas;
