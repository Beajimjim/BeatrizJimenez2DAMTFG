-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-06-2025 a las 22:43:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `smart3z_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignaciones`
--

CREATE TABLE `asignaciones` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_proyecto` int(10) UNSIGNED NOT NULL,
  `fecha_asignacion` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `id_departamento` int(10) UNSIGNED NOT NULL,
  `id_empresa` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `departamentos`
--

INSERT INTO `departamentos` (`id_departamento`, `id_empresa`, `nombre`) VALUES
(1, 1, 'Banca'),
(2, 1, 'Industria'),
(3, 1, 'Público'),
(6, 1, 'Sanidad'),
(7, 1, 'Educación'),
(8, 1, 'Logística'),
(9, 1, 'Seguros'),
(10, 1, 'Energía'),
(11, 1, 'Retail'),
(12, 1, 'Telecomunicaciones'),
(13, 1, 'Transporte'),
(14, 1, 'Administración Pública'),
(15, 1, 'Finanzas'),
(16, 1, 'Centro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `id_empresa` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `cif` varchar(20) NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresas`
--

INSERT INTO `empresas` (`id_empresa`, `nombre`, `cif`, `fecha_creacion`) VALUES
(1, 'TechNova', 'B12345678', '2025-04-26 17:24:30'),
(2, 'InnovaSoft', 'C87654321', '2025-04-26 17:24:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estimaciones`
--

CREATE TABLE `estimaciones` (
  `id_estimacion` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  `fecha_generada` datetime NOT NULL DEFAULT current_timestamp(),
  `total_horas` int(11) NOT NULL,
  `coste_total` decimal(12,2) NOT NULL,
  `resumen_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`resumen_json`)),
  `calendario_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`calendario_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estimaciones`
--

INSERT INTO `estimaciones` (`id_estimacion`, `id_proyecto`, `fecha_generada`, `total_horas`, `coste_total`, `resumen_json`, `calendario_json`) VALUES
(1, 9, '2025-05-15 21:24:48', 221, 6223.00, '[{\"nombre\":\"Diseñador Senior\",\"horas\":30,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":900},{\"nombre\":\"Project Manager\",\"horas\":15,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1.3,\"recomendacion\":\"1 completo + 1 al 30%\",\"coste\":675},{\"nombre\":\"Desarrollador Senior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1400},{\"nombre\":\"DevOps Junior\",\"horas\":36,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1008},{\"nombre\":\"Diseñador Junior\",\"horas\":60,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 completos\",\"coste\":1200},{\"nombre\":\"Desarrollador Junior\",\"horas\":24,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":528},{\"nombre\":\"QA Senior\",\"horas\":16,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":512}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0}'),
(3, 9, '2025-05-15 21:26:13', 221, 6223.00, '[{\"nombre\":\"Diseñador Senior\",\"horas\":30,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":900},{\"nombre\":\"Project Manager\",\"horas\":15,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1.3,\"recomendacion\":\"1 completo + 1 al 30%\",\"coste\":675},{\"nombre\":\"Desarrollador Senior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1400},{\"nombre\":\"DevOps Junior\",\"horas\":36,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1008},{\"nombre\":\"Diseñador Junior\",\"horas\":60,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 completos\",\"coste\":1200},{\"nombre\":\"Desarrollador Junior\",\"horas\":24,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":528},{\"nombre\":\"QA Senior\",\"horas\":16,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":512}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":6,\"vacaciones\":0}'),
(4, 9, '2025-05-15 21:33:23', 221, 6223.00, '[{\"nombre\":\"Diseñador Senior\",\"horas\":30,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":900},{\"nombre\":\"Project Manager\",\"horas\":15,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1.3,\"recomendacion\":\"1 completo + 1 al 30%\",\"coste\":675},{\"nombre\":\"Desarrollador Senior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1400},{\"nombre\":\"DevOps Junior\",\"horas\":36,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1008},{\"nombre\":\"Diseñador Junior\",\"horas\":60,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 completos\",\"coste\":1200},{\"nombre\":\"Desarrollador Junior\",\"horas\":24,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":528},{\"nombre\":\"QA Senior\",\"horas\":16,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":512}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0}'),
(5, 9, '2025-05-15 21:40:40', 221, 6223.00, '[{\"nombre\":\"Diseñador Senior\",\"horas\":30,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":900},{\"nombre\":\"Project Manager\",\"horas\":15,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1.3,\"recomendacion\":\"1 completo + 1 al 30%\",\"coste\":675},{\"nombre\":\"Desarrollador Senior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1400},{\"nombre\":\"DevOps Junior\",\"horas\":36,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1008},{\"nombre\":\"Diseñador Junior\",\"horas\":60,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 completos\",\"coste\":1200},{\"nombre\":\"Desarrollador Junior\",\"horas\":24,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":528},{\"nombre\":\"QA Senior\",\"horas\":16,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":512}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0}'),
(6, 9, '2025-05-15 21:59:58', 221, 6223.00, '[{\"nombre\":\"Diseñador Senior\",\"horas\":30,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":900},{\"nombre\":\"Project Manager\",\"horas\":15,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1.3,\"recomendacion\":\"1 completo + 1 al 30%\",\"coste\":675},{\"nombre\":\"Desarrollador Senior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1400},{\"nombre\":\"DevOps Junior\",\"horas\":36,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1008},{\"nombre\":\"Diseñador Junior\",\"horas\":60,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 completos\",\"coste\":1200},{\"nombre\":\"Desarrollador Junior\",\"horas\":24,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":528},{\"nombre\":\"QA Senior\",\"horas\":16,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":512}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0}'),
(7, 17, '2025-05-15 22:06:54', 254, 5358.00, '[{\"nombre\":\"Diseñador Junior\",\"horas\":115,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":2300},{\"nombre\":\"Desarrollador Junior\",\"horas\":139,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 completos\",\"coste\":3058}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":10,\"vacaciones\":0}'),
(8, 9, '2025-05-16 21:05:58', 176, 4648.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1400},{\"nombre\":\"DevOps Junior\",\"horas\":36,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1008},{\"nombre\":\"Diseñador Junior\",\"horas\":60,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 completos\",\"coste\":1200},{\"nombre\":\"Desarrollador Junior\",\"horas\":24,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":528},{\"nombre\":\"QA Senior\",\"horas\":16,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":512}]', '{\"horasPorDia\":9,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0}'),
(9, 9, '2025-05-16 21:14:37', 176, 4648.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1400},{\"nombre\":\"DevOps Junior\",\"horas\":36,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":1008},{\"nombre\":\"Diseñador Junior\",\"horas\":60,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 completos\",\"coste\":1200},{\"nombre\":\"Desarrollador Junior\",\"horas\":24,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":528},{\"nombre\":\"QA Senior\",\"horas\":16,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":512}]', '{\"horasPorDia\":9,\"diasLaborablesPorSemana\":5,\"festivos\":2,\"vacaciones\":0}'),
(10, 17, '2025-05-17 14:09:25', 254, 5358.00, '[{\"nombre\":\"Diseñador Junior\",\"horas\":115,\"picoConcurrencia\":1,\"coberturaVacaciones\":78,\"plantillaFinal\":1.8,\"recomendacion\":\"1 completo + 1 al 80%\",\"coste\":2300},{\"nombre\":\"Desarrollador Junior\",\"horas\":139,\"picoConcurrencia\":2,\"coberturaVacaciones\":78,\"plantillaFinal\":3.6,\"recomendacion\":\"3 completos + 1 al 60%\",\"coste\":3058}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":7,\"vacaciones\":4}'),
(11, 17, '2025-05-17 14:10:16', 254, 5358.00, '[{\"nombre\":\"Diseñador Junior\",\"horas\":115,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":2300},{\"nombre\":\"Desarrollador Junior\",\"horas\":139,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 completos\",\"coste\":3058}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":9,\"vacaciones\":0}'),
(12, 18, '2025-05-17 14:41:01', 56, 1200.00, '[{\"nombre\":\"Diseñador Junior\",\"horas\":16,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":320},{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 completo\",\"coste\":880}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":7,\"vacaciones\":0}'),
(13, 18, '2025-05-18 18:17:58', 104, 2160.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":880},{\"nombre\":\"Diseñador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1280},{\"nombre\":\"Analista Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"Analista Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"QA Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"QA Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"Project Manager\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"DevOps Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"DevOps Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0}'),
(14, 18, '2025-05-18 18:19:08', 104, 2160.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":880},{\"nombre\":\"Diseñador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1280},{\"nombre\":\"Analista Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"Analista Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"QA Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"QA Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"Project Manager\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"DevOps Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0},{\"nombre\":\"DevOps Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0}'),
(15, 18, '2025-05-18 18:48:53', 104, 2160.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":880,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1280,\"hayCapacidad\":false},{\"nombre\":\"Analista Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Analista Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"QA Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"QA Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Project Manager\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"DevOps Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"DevOps Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0}'),
(16, 18, '2025-05-18 18:49:25', 104, 2160.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":880,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1280,\"hayCapacidad\":false},{\"nombre\":\"Analista Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Analista Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"QA Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"QA Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Project Manager\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"DevOps Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"DevOps Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":3,\"festivos\":0,\"vacaciones\":0}'),
(17, 18, '2025-05-18 19:04:12', 104, 3897.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":1382.857142857143,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":2514.2857142857147,\"hayCapacidad\":false},{\"nombre\":\"Analista Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Analista Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"QA Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"QA Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Project Manager\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"DevOps Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"DevOps Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0}'),
(18, 18, '2025-05-18 19:04:28', 104, 3168.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1659.4285714285716,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1508.5714285714287,\"hayCapacidad\":false},{\"nombre\":\"Analista Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Analista Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"QA Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"QA Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"Project Manager\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"DevOps Senior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true},{\"nombre\":\"DevOps Junior\",\"horas\":0,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":0,\"recomendacion\":\"0 persona(s)\",\"coste\":0,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":3,\"festivos\":0,\"vacaciones\":0}'),
(19, 18, '2025-05-18 20:08:41', 104, 2808.00, '[{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":1144,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1664,\"hayCapacidad\":false}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":0,\"vacaciones\":0,\"socialRate\":30}'),
(20, 18, '2025-05-18 20:09:03', 104, 2808.00, '[{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1144,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":3,\"recomendacion\":\"3 persona(s)\",\"coste\":1664,\"hayCapacidad\":false}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":5,\"vacaciones\":0,\"socialRate\":30}'),
(21, 18, '2025-05-18 20:13:10', 104, 2873.00, '[{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1181.7142857142858,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":0,\"coberturaVacaciones\":0,\"plantillaFinal\":3,\"recomendacion\":\"3 persona(s)\",\"coste\":1691.4285714285716,\"hayCapacidad\":false}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"festivos\":5,\"vacaciones\":0,\"socialRate\":30}'),
(22, 18, '2025-05-18 21:41:06', 104, 3078.00, '[{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":1181.7142857142858,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":1897.1428571428573,\"hayCapacidad\":false}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"socialRate\":30}'),
(23, 18, '2025-05-18 22:00:18', 104, 4778.00, '[{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":1739.8857142857141,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":64,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":3038.8571428571427,\"hayCapacidad\":false}]', '{\"horasPorDia\":19,\"diasLaborablesPorSemana\":6,\"socialRate\":30}'),
(24, 19, '2025-05-24 20:55:17', 75, 3203.00, '[{\"nombre\":\"Analista Junior\",\"horas\":75,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":3203.5714285714284,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"socialRate\":30}'),
(25, 18, '2025-06-01 11:16:50', 106, 4880.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":18,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":2430,\"hayCapacidad\":true},{\"nombre\":\"Desarrollador Junior\",\"horas\":40,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":1181.7142857142858,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":48,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":1268.5714285714287,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"socialRate\":30}'),
(26, 23, '2025-06-02 19:24:54', 78, 4994.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":8,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":520,\"hayCapacidad\":true},{\"nombre\":\"Desarrollador Junior\",\"horas\":10,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":974.2857142857142,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":24,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":1302.8571428571427,\"hayCapacidad\":true},{\"nombre\":\"Project Manager\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":771.4285714285714,\"hayCapacidad\":true},{\"nombre\":\"DevOps Senior\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":754.2857142857142,\"hayCapacidad\":true},{\"nombre\":\"DevOps Junior\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":672,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"socialRate\":30}'),
(27, 23, '2025-06-02 19:42:40', 78, 4874.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":8,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":520,\"hayCapacidad\":true},{\"nombre\":\"Desarrollador Junior\",\"horas\":10,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":974.2857142857142,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Junior\",\"horas\":24,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":1302.8571428571427,\"hayCapacidad\":true},{\"nombre\":\"Analista Senior\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":651.4285714285714,\"hayCapacidad\":true},{\"nombre\":\"DevOps Senior\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":754.2857142857142,\"hayCapacidad\":true},{\"nombre\":\"DevOps Junior\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":672,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"socialRate\":30}'),
(28, 25, '2025-06-02 19:42:56', 60, 4533.00, '[{\"nombre\":\"Desarrollador Junior\",\"horas\":4,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":201.1428571428571,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Senior\",\"horas\":4,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":428.5714285714285,\"hayCapacidad\":true},{\"nombre\":\"Analista Senior\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":716.5714285714286,\"hayCapacidad\":true},{\"nombre\":\"Analista Junior\",\"horas\":26,\"picoConcurrencia\":2,\"coberturaVacaciones\":0,\"plantillaFinal\":2,\"recomendacion\":\"2 persona(s)\",\"coste\":2107.142857142857,\"hayCapacidad\":true},{\"nombre\":\"QA Senior\",\"horas\":4,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":402.2857142857143,\"hayCapacidad\":true},{\"nombre\":\"QA Junior\",\"horas\":10,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":678,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"socialRate\":30}'),
(29, 24, '2025-06-02 20:14:17', 74, 4469.00, '[{\"nombre\":\"Desarrollador Senior\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":720,\"hayCapacidad\":true},{\"nombre\":\"Desarrollador Junior\",\"horas\":22,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":1162.857142857143,\"hayCapacidad\":true},{\"nombre\":\"Diseñador Senior\",\"horas\":4,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":274.2857142857142,\"hayCapacidad\":true},{\"nombre\":\"Analista Senior\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":781.7142857142858,\"hayCapacidad\":true},{\"nombre\":\"QA Junior\",\"horas\":12,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":540,\"hayCapacidad\":true},{\"nombre\":\"DevOps Senior\",\"horas\":6,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":582.8571428571429,\"hayCapacidad\":true},{\"nombre\":\"DevOps Junior\",\"horas\":6,\"picoConcurrencia\":1,\"coberturaVacaciones\":0,\"plantillaFinal\":1,\"recomendacion\":\"1 persona(s)\",\"coste\":408,\"hayCapacidad\":true}]', '{\"horasPorDia\":8,\"diasLaborablesPorSemana\":5,\"socialRate\":30}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfiles`
--

CREATE TABLE `perfiles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `tarifa` decimal(6,2) NOT NULL,
  `horas_extra` tinyint(1) DEFAULT 0,
  `tarifa_extra` decimal(6,2) DEFAULT NULL,
  `disponibilidad` int(11) DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfiles`
--

INSERT INTO `perfiles` (`id`, `nombre`, `tarifa`, `horas_extra`, `tarifa_extra`, `disponibilidad`) VALUES
(1, 'Desarrollador Senior', 35.00, 1, 45.00, 100),
(2, 'Desarrollador Junior', 22.00, 1, 28.00, 100),
(3, 'Diseñador Senior', 30.00, 1, 40.00, 100),
(4, 'Diseñador Junior', 20.00, 1, 26.00, 100),
(5, 'Analista Senior', 38.00, 1, 50.00, 100),
(6, 'Analista Junior', 25.00, 0, NULL, 100),
(7, 'QA Senior', 32.00, 1, 42.00, 100),
(8, 'QA Junior', 21.00, 1, 27.00, 100),
(9, 'Project Manager', 45.00, 0, NULL, 80),
(10, 'DevOps Senior', 40.00, 1, 52.00, 100),
(11, 'DevOps Junior', 28.00, 1, 35.00, 100),
(12, 'CEO', 100.00, 0, NULL, 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE `personal` (
  `id_personal` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_perfil` int(11) NOT NULL,
  `horas_max_semana` int(11) DEFAULT 40,
  `horas_max_dia` int(11) DEFAULT 8,
  `disponibilidad` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`disponibilidad`)),
  `vacaciones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`vacaciones`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personal`
--

INSERT INTO `personal` (`id_personal`, `id_usuario`, `id_perfil`, `horas_max_semana`, `horas_max_dia`, `disponibilidad`, `vacaciones`) VALUES
(1, 1, 12, 45, 9, '{\"L\":9,\"M\":9,\"X\":9,\"J\":9,\"V\":9}', '[{\"inicio\":\"2025-07-22\",\"fin\":\"2025-07-31\"}]'),
(2, 2, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-05\",\"fin\":\"2025-08-14\"}]'),
(3, 5, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-09-15\",\"fin\":\"2025-09-22\"}]'),
(4, 15, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-12-24\",\"fin\":\"2026-01-02\"}]'),
(5, 18, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-01\",\"fin\":\"2025-08-10\"}]'),
(6, 20, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-11-02\",\"fin\":\"2025-11-06\"}]'),
(7, 21, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-07-10\",\"fin\":\"2025-07-17\"}]'),
(8, 22, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-20\",\"fin\":\"2025-08-27\"}]'),
(9, 23, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-10-05\",\"fin\":\"2025-10-09\"}]'),
(10, 24, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-09-01\",\"fin\":\"2025-09-08\"}]'),
(11, 25, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-07-30\",\"fin\":\"2025-08-06\"}]'),
(12, 26, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-12-01\",\"fin\":\"2025-12-05\"}]'),
(13, 27, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-15\",\"fin\":\"2025-08-20\"}]'),
(14, 28, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-11-25\",\"fin\":\"2025-11-30\"}]'),
(15, 29, 9, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-06-20\",\"fin\":\"2025-06-27\"}]'),
(16, 3, 1, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-09-10\",\"fin\":\"2025-09-17\"}]'),
(17, 4, 2, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-10-15\",\"fin\":\"2025-10-22\"}]'),
(18, 6, 3, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-07-05\",\"fin\":\"2025-07-12\"}]'),
(19, 12, 4, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-25\",\"fin\":\"2025-09-02\"}]'),
(20, 13, 5, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-12-15\",\"fin\":\"2025-12-22\"}]'),
(21, 14, 6, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-07-18\",\"fin\":\"2025-07-25\"}]'),
(22, 16, 7, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-09-20\",\"fin\":\"2025-09-27\"}]'),
(23, 17, 8, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-08\",\"fin\":\"2025-08-14\"}]'),
(24, 30, 10, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-11-10\",\"fin\":\"2025-11-17\"}]'),
(25, 31, 11, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-07-22\",\"fin\":\"2025-07-29\"}]'),
(26, 32, 1, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-12\",\"fin\":\"2025-08-19\"}]'),
(27, 33, 2, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-09-01\",\"fin\":\"2025-09-08\"}]'),
(28, 34, 3, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-07-22\",\"fin\":\"2025-07-29\"}]'),
(29, 35, 4, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-11-10\",\"fin\":\"2025-11-17\"}]'),
(30, 36, 5, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-10-04\",\"fin\":\"2025-10-11\"}]'),
(31, 37, 6, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-12-20\",\"fin\":\"2025-12-28\"}]'),
(32, 38, 7, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-26\",\"fin\":\"2025-09-02\"}]'),
(33, 39, 8, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-09-15\",\"fin\":\"2025-09-22\"}]'),
(34, 40, 10, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-07-08\",\"fin\":\"2025-07-15\"}]'),
(35, 41, 11, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-11-24\",\"fin\":\"2025-11-30\"}]'),
(36, 42, 1, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-10-18\",\"fin\":\"2025-10-25\"}]'),
(37, 43, 2, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-12-05\",\"fin\":\"2025-12-12\"}]'),
(38, 44, 3, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-01\",\"fin\":\"2025-08-08\"}]'),
(39, 45, 4, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-09-26\",\"fin\":\"2025-10-02\"}]'),
(40, 46, 5, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-07-29\",\"fin\":\"2025-08-04\"}]'),
(41, 47, 6, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-11-12\",\"fin\":\"2025-11-19\"}]'),
(42, 48, 7, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-08-19\",\"fin\":\"2025-08-26\"}]'),
(43, 49, 8, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-09-09\",\"fin\":\"2025-09-16\"}]'),
(44, 50, 10, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-10-30\",\"fin\":\"2025-11-05\"}]'),
(45, 51, 11, 40, 8, '{\"L\":8,\"M\":8,\"X\":8,\"J\":8,\"V\":8}', '[{\"inicio\":\"2025-07-14\",\"fin\":\"2025-07-21\"}]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `id_proyecto` int(10) UNSIGNED NOT NULL,
  `id_departamento` int(10) UNSIGNED NOT NULL,
  `id_jefe_pm` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` enum('EN_CURSO','PAUSADO','FINALIZADO') DEFAULT 'EN_CURSO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`id_proyecto`, `id_departamento`, `id_jefe_pm`, `nombre`, `descripcion`, `fecha_inicio`, `fecha_fin`, `estado`) VALUES
(23, 1, 2, 'Core bancario móvil', 'Desarrollo de app bancaria para clientes', '2025-05-01', NULL, 'EN_CURSO'),
(24, 1, 2, 'Open Banking API', 'Integración con proveedores externos', '2025-05-15', NULL, 'EN_CURSO'),
(25, 1, 2, 'Fraude AI', 'Sistema de detección de fraudes con IA', '2025-05-25', NULL, 'EN_CURSO'),
(26, 2, 5, 'Automatización planta', 'Control y supervisión de líneas de producción', '2025-05-01', NULL, 'EN_CURSO'),
(27, 2, 5, 'Gemelo digital', 'Simulación en tiempo real de procesos industriales', '2025-05-10', NULL, 'EN_CURSO'),
(28, 2, 5, 'SCADA Web', 'Panel de control industrial en la nube', '2025-05-20', NULL, 'EN_CURSO'),
(29, 3, 18, 'Portal ciudadano', 'Plataforma para trámites online', '2025-05-01', NULL, 'EN_CURSO'),
(30, 3, 18, 'Presupuestos participativos', 'Gestión y votación digital de presupuestos', '2025-05-12', NULL, 'EN_CURSO'),
(31, 3, 18, 'Identidad digital', 'Sistema de acceso seguro para ciudadanos', '2025-05-22', NULL, 'EN_CURSO'),
(32, 6, 20, 'Historial clínico electrónico', 'Centralización de datos médicos', '2025-05-01', NULL, 'EN_CURSO'),
(33, 6, 20, 'Agenda médica inteligente', 'Optimización de citas y recursos', '2025-05-14', NULL, 'EN_CURSO'),
(34, 6, 20, 'Telemedicina avanzada', 'Consultas virtuales con IA de apoyo', '2025-05-25', NULL, 'EN_CURSO'),
(35, 7, 21, 'Campus virtual', 'Plataforma de aprendizaje online', '2025-05-01', NULL, 'EN_CURSO'),
(36, 7, 21, 'Evaluación digital', 'Herramienta de exámenes online con IA', '2025-05-13', NULL, 'EN_CURSO'),
(37, 7, 21, 'Sistema de tutorías', 'Gestión de tutorías académicas', '2025-05-24', NULL, 'EN_CURSO'),
(38, 8, 22, 'Gestión de flotas', 'Optimización de rutas y mantenimiento', '2025-05-01', NULL, 'EN_CURSO'),
(39, 8, 22, 'Trazabilidad de envíos', 'Seguimiento en tiempo real de paquetes', '2025-05-16', NULL, 'EN_CURSO'),
(40, 8, 22, 'Almacén inteligente', 'Gestión de inventario automatizada', '2025-05-27', NULL, 'EN_CURSO'),
(41, 9, 23, 'Evaluación automática de siniestros', 'IA para peritaje digital', '2025-05-01', NULL, 'EN_CURSO'),
(42, 9, 23, 'App de pólizas', 'Gestión y consulta de pólizas por móvil', '2025-05-11', NULL, 'EN_CURSO'),
(43, 9, 23, 'Chatbot de soporte', 'Atención al cliente automatizada', '2025-05-23', NULL, 'EN_CURSO'),
(44, 10, 24, 'Smart Metering', 'Medición remota y análisis energético', '2025-05-01', NULL, 'EN_CURSO'),
(45, 10, 24, 'Gestión de red inteligente', 'Monitorización y balanceo de cargas', '2025-05-17', NULL, 'EN_CURSO'),
(46, 10, 24, 'App cliente energía', 'Control de consumo y facturación', '2025-05-28', NULL, 'EN_CURSO'),
(47, 11, 25, 'Marketplace sectorial', 'Plataforma multivendedor', '2025-05-01', NULL, 'EN_CURSO'),
(48, 11, 25, 'CRM minorista', 'Fidelización y campañas personalizadas', '2025-05-18', NULL, 'EN_CURSO'),
(49, 11, 25, 'Gestión omnicanal', 'Integración de tiendas físicas y online', '2025-05-29', NULL, 'EN_CURSO'),
(50, 12, 26, 'Infraestructura 5G', 'Despliegue y monitoreo de antenas', '2025-05-01', NULL, 'EN_CURSO'),
(51, 12, 26, 'Portal cliente telecom', 'Facturación, consumo y soporte', '2025-05-19', NULL, 'EN_CURSO'),
(52, 12, 26, 'Plataforma de streaming', 'Lanzamiento de servicio audiovisual', '2025-05-30', NULL, 'EN_CURSO'),
(53, 13, 27, 'Billetaje inteligente', 'Sistema de pago sin contacto', '2025-05-01', NULL, 'EN_CURSO'),
(54, 13, 27, 'Planificador urbano', 'Optimización de rutas de transporte público', '2025-05-20', NULL, 'EN_CURSO'),
(55, 13, 27, 'Control de tráfico', 'Análisis y predicción de congestiones', '2025-05-31', NULL, 'EN_CURSO'),
(56, 14, 28, 'Transparencia y datos abiertos', 'Portal para acceso a datos gubernamentales', '2025-05-01', NULL, 'EN_CURSO'),
(57, 14, 28, 'Gestión documental', 'Archivo y recuperación de expedientes', '2025-05-21', NULL, 'EN_CURSO'),
(58, 14, 28, 'Firma electrónica avanzada', 'Sistema de autenticación legal', '2025-06-01', NULL, 'EN_CURSO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `id` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `horas` int(11) NOT NULL CHECK (`horas` > 0),
  `estado` enum('pendiente','en curso','finalizada') NOT NULL DEFAULT 'pendiente',
  `id_perfil` int(11) DEFAULT NULL,
  `dependencia_ids` varchar(255) DEFAULT NULL,
  `horas_incurridas` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id`, `id_proyecto`, `id_usuario`, `nombre`, `descripcion`, `fecha_inicio`, `fecha_fin`, `horas`, `estado`, `id_perfil`, `dependencia_ids`, `horas_incurridas`) VALUES
(3, 23, 3, 'Core bancario móvil - Tarea 3', 'Desarrollar lógica de negocio para transferencias interbancarias.', '2025-05-05', '2025-05-08', 8, 'en curso', 1, '0', 6),
(4, 23, 13, 'Core bancario móvil - Tarea 4', 'Crear interfaz para autenticación biométrica en la app móvil.', '2025-05-07', '2025-05-09', 12, 'pendiente', 5, '', 0),
(5, 23, 40, 'Core bancario móvil - Tarea 5', 'Integrar servicio de notificaciones push para movimientos de cuenta.', '2025-05-09', '2025-05-12', 12, 'pendiente', 10, '', 0),
(6, 23, 19, 'Core bancario móvil - Tarea 6', 'Configurar pruebas unitarias y de integración para el módulo de pagos.', '2025-05-11', '2025-05-15', 8, 'pendiente', 4, NULL, 0),
(7, 23, 35, 'Core bancario móvil - Tarea 7', 'Implementar encriptación de datos sensibles en tránsito y reposo.', '2025-05-13', '2025-05-15', 4, 'pendiente', 11, NULL, 0),
(8, 23, 25, 'Core bancario móvil - Tarea 8', 'Optimizar el rendimiento del motor de transacciones en Android.', '2025-05-15', '2025-05-19', 8, 'pendiente', 11, NULL, 0),
(9, 23, 17, 'Core bancario móvil - Tarea 9', 'Configurar monitorización y alertas para el core bancario móvil.', '2025-05-17', '2025-05-22', 4, 'pendiente', 2, NULL, 0),
(10, 23, 19, 'Core bancario móvil - Tarea 10', 'Documentar API pública y generar swagger para integradores externos.', '2025-05-19', '2025-05-24', 4, 'pendiente', 4, NULL, 0),
(11, 24, 16, 'Open Banking API - Tarea 1', 'Diseñar especificación OpenAPI v3 para endpoint de enlaces de cuentas.', '2025-05-15', '2025-05-19', 12, 'pendiente', 1, NULL, 0),
(12, 24, 27, 'Open Banking API - Tarea 2', 'Implementar autenticación OAuth2.0 para clientes terceros.', '2025-05-17', '2025-05-20', 6, 'pendiente', 2, NULL, 0),
(13, 24, 35, 'Open Banking API - Tarea 3', 'Desarrollar tests de contrato para la API de transacciones.', '2025-05-19', '2025-05-23', 6, 'pendiente', 11, NULL, 0),
(14, 24, 23, 'Open Banking API - Tarea 4', 'Configurar gateway API con limitación de tasa y enrutamiento.', '2025-05-21', '2025-05-23', 8, 'pendiente', 8, NULL, 0),
(15, 24, 17, 'Open Banking API - Tarea 5', 'Implementar paginación y filtros en endpoint de movimientos.', '2025-05-23', '2025-05-27', 8, 'pendiente', 2, NULL, 0),
(16, 24, 23, 'Open Banking API - Tarea 6', 'Crear pipeline CI/CD para despliegue automático en Kubernetes.', '2025-05-25', '2025-05-28', 4, 'pendiente', 8, NULL, 0),
(17, 24, 24, 'Open Banking API - Tarea 7', 'Realizar pruebas de penetración sobre los nuevos endpoints.', '2025-05-27', '2025-05-31', 6, 'pendiente', 10, NULL, 0),
(18, 24, 17, 'Open Banking API - Tarea 8', 'Desarrollar módulo de auditoría y logging normativo.', '2025-05-29', '2025-06-03', 8, 'pendiente', 2, NULL, 0),
(19, 24, 13, 'Open Banking API - Tarea 9', 'Optimizar consultas SQL para mejorar latencia de respuesta.', '2025-05-31', '2025-06-04', 12, 'pendiente', 5, '0', 0),
(20, 24, NULL, 'Open Banking API - Tarea 10', 'Publicar documentación técnica en portal para desarrolladores.', '2025-06-02', '2025-06-04', 4, 'pendiente', 3, NULL, 0),
(21, 25, 21, 'Fraude AI - Tarea 1', 'Recolectar dataset etiquetado de transacciones fraudulentas.', '2025-05-25', '2025-05-27', 6, 'pendiente', 6, NULL, 6),
(22, 25, 31, 'Fraude AI - Tarea 2', 'Preprocesar datos y generar variables derivadas para el modelo.', '2025-05-27', '2025-05-29', 6, 'pendiente', 6, NULL, 0),
(23, 25, 20, 'Fraude AI - Tarea 3', 'Entrenar modelo de machine learning para detección de fraude.', '2025-05-29', '2025-06-01', 12, 'pendiente', 5, NULL, 0),
(24, 25, 22, 'Fraude AI - Tarea 4', 'Evaluar métricas de precisión y ajustar hiperparámetros.', '2025-05-31', '2025-06-04', 4, 'pendiente', 7, NULL, 0),
(25, 25, 23, 'Fraude AI - Tarea 5', 'Implementar servicio en tiempo real para scoring de transacciones.', '2025-06-02', '2025-06-06', 4, 'pendiente', 8, NULL, 0),
(26, 25, 31, 'Fraude AI - Tarea 6', 'Crear dashboard de métricas de fraude en Grafana.', '2025-06-04', '2025-06-09', 8, 'pendiente', 6, NULL, 0),
(27, 25, 18, 'Fraude AI - Tarea 7', 'Desplegar modelo en entorno de staging con Docker.', '2025-06-06', '2025-06-11', 4, 'pendiente', 3, NULL, 0),
(28, 25, 21, 'Fraude AI - Tarea 8', 'Diseñar estrategia de A/B testing para reglas antifraude.', '2025-06-08', '2025-06-10', 6, 'pendiente', 6, NULL, 0),
(29, 25, 17, 'Fraude AI - Tarea 9', 'Implementar sistema de retroalimentación de falsos positivos.', '2025-06-10', '2025-06-12', 4, 'pendiente', 2, NULL, 0),
(30, 25, 23, 'Fraude AI - Tarea 10', 'Documentar proceso de gobernanza de datos y modelo.', '2025-06-12', '2025-06-14', 6, 'pendiente', 8, NULL, 0),
(31, 26, NULL, 'Automatización planta - Tarea 1', 'Analizar flujo de producción y definir puntos de automatización.', '2025-05-01', '2025-05-04', 6, 'pendiente', 2, NULL, 0),
(32, 26, NULL, 'Automatización planta - Tarea 2', 'Programar PLCs para línea de empaquetado.', '2025-05-03', '2025-05-08', 8, 'pendiente', 5, NULL, 0),
(33, 26, NULL, 'Automatización planta - Tarea 3', 'Integrar sensores IoT con plataforma SCADA.', '2025-05-05', '2025-05-09', 4, 'pendiente', 11, NULL, 0),
(34, 26, NULL, 'Automatización planta - Tarea 4', 'Configurar red industrial Ethernet y VLANs.', '2025-05-07', '2025-05-10', 6, 'pendiente', 7, NULL, 0),
(35, 26, NULL, 'Automatización planta - Tarea 5', 'Desarrollar HMI para monitoreo de la planta.', '2025-05-09', '2025-05-14', 8, 'pendiente', 7, NULL, 0),
(36, 26, NULL, 'Automatización planta - Tarea 6', 'Implementar sistema de alertas predictivas por vibración.', '2025-05-11', '2025-05-15', 4, 'pendiente', 10, NULL, 0),
(37, 26, NULL, 'Automatización planta - Tarea 7', 'Optimizar consumo energético mediante control automático.', '2025-05-13', '2025-05-16', 12, 'pendiente', 10, NULL, 0),
(38, 26, NULL, 'Automatización planta - Tarea 8', 'Realizar pruebas FAT/SAT de los sistemas automatizados.', '2025-05-15', '2025-05-18', 12, 'pendiente', 7, NULL, 0),
(39, 26, NULL, 'Automatización planta - Tarea 9', 'Documentar manual operativo y planos eléctricos.', '2025-05-17', '2025-05-22', 8, 'pendiente', 8, NULL, 0),
(40, 26, NULL, 'Automatización planta - Tarea 10', 'Capacitar al personal en uso del nuevo sistema.', '2025-05-19', '2025-05-21', 12, 'pendiente', 2, NULL, 0),
(41, 27, 22, 'Gemelo digital - Tarea 1', 'Recolectar datos de procesos y activos para el modelo 3D.', '2025-05-10', '2025-05-15', 6, 'pendiente', 7, NULL, 0),
(42, 27, 45, 'Gemelo digital - Tarea 2', 'Construir modelo CAD simplificado del equipo crítico.', '2025-05-12', '2025-05-15', 12, 'pendiente', 11, NULL, 0),
(43, 27, 21, 'Gemelo digital - Tarea 3', 'Sincronizar datos en tiempo real con plataforma de gemelo.', '2025-05-14', '2025-05-19', 4, 'pendiente', 6, NULL, 0),
(44, 27, 20, 'Gemelo digital - Tarea 4', 'Definir reglas de simulación para escenarios de fallo.', '2025-05-16', '2025-05-19', 12, 'pendiente', 5, NULL, 0),
(45, 27, 39, 'Gemelo digital - Tarea 5', 'Implementar vista web interactiva del gemelo digital.', '2025-05-18', '2025-05-23', 8, 'pendiente', 4, NULL, 0),
(46, 27, 13, 'Gemelo digital - Tarea 6', 'Establecer KPIs y panel de control de desempeño.', '2025-05-20', '2025-05-24', 4, 'pendiente', 5, '', 0),
(47, 27, 41, 'Gemelo digital - Tarea 7', 'Configurar integraciones con ERP y sistema MES.', '2025-05-22', '2025-05-27', 4, 'pendiente', 6, NULL, 0),
(48, 27, 18, 'Gemelo digital - Tarea 8', 'Realizar validación de precisión del gemelo frente a datos reales.', '2025-05-24', '2025-05-26', 12, 'pendiente', 3, NULL, 0),
(50, 27, 33, 'Gemelo digital - Tarea 10', 'Crear documentación de mantenimiento predictivo basado en el gemelo.', '2025-05-28', '2025-05-30', 8, 'pendiente', 8, NULL, 0),
(51, 28, NULL, 'SCADA Web - Tarea 1', 'Diseñar arquitectura de microservicios para SCADA web.', '2025-05-20', '2025-05-24', 4, 'pendiente', 8, NULL, 0),
(52, 28, NULL, 'SCADA Web - Tarea 2', 'Implementar websocket para transmisión de datos en tiempo real.', '2025-05-22', '2025-05-25', 8, 'pendiente', 3, NULL, 0),
(53, 28, NULL, 'SCADA Web - Tarea 3', 'Crear componente de dashboard con gráficos de tendencia.', '2025-05-24', '2025-05-29', 6, 'pendiente', 1, NULL, 0),
(54, 28, 19, 'SCADA Web - Tarea 4', 'Agregar autenticación SSO mediante OpenID Connect.', '2025-05-26', '2025-05-30', 6, 'pendiente', 4, NULL, 0),
(55, 28, NULL, 'SCADA Web - Tarea 5', 'Configurar balanceador de carga y autoescalado.', '2025-05-28', '2025-06-02', 12, 'pendiente', 10, NULL, 0),
(56, 28, NULL, 'SCADA Web - Tarea 6', 'Desarrollar script de infraestructura como código con Terraform.', '2025-05-30', '2025-06-04', 6, 'pendiente', 10, NULL, 0),
(57, 28, NULL, 'SCADA Web - Tarea 7', 'Ejecutar pruebas de estrés sobre la API de datos.', '2025-06-01', '2025-06-05', 8, 'pendiente', 4, NULL, 0),
(58, 28, NULL, 'SCADA Web - Tarea 8', 'Optimizar uso de memoria en frontend React.', '2025-06-03', '2025-06-07', 8, 'pendiente', 1, NULL, 0),
(59, 28, NULL, 'SCADA Web - Tarea 9', 'Establecer cobertura de pruebas unitarias al 90%.', '2025-06-05', '2025-06-07', 4, 'pendiente', 7, NULL, 0),
(60, 28, NULL, 'SCADA Web - Tarea 10', 'Publicar manual de operación en línea.', '2025-06-07', '2025-06-11', 6, 'pendiente', 6, NULL, 0),
(61, 29, NULL, 'Portal ciudadano - Tarea 1', 'Levantar requisitos de accesibilidad para cumplimiento AA.', '2025-05-01', '2025-05-03', 4, 'pendiente', 5, NULL, 0),
(62, 29, NULL, 'Portal ciudadano - Tarea 2', 'Diseñar interfaz UX para trámites electrónicos.', '2025-05-03', '2025-05-08', 12, 'pendiente', 8, NULL, 0),
(63, 29, NULL, 'Portal ciudadano - Tarea 3', 'Implementar buscador elástico para servicios municipales.', '2025-05-05', '2025-05-07', 6, 'pendiente', 2, NULL, 0),
(64, 29, NULL, 'Portal ciudadano - Tarea 4', 'Crear módulo de pagos integrando pasarela gubernamental.', '2025-05-07', '2025-05-10', 8, 'pendiente', 7, NULL, 0),
(65, 29, NULL, 'Portal ciudadano - Tarea 5', 'Configurar analítica web para medir uso de la plataforma.', '2025-05-09', '2025-05-13', 8, 'pendiente', 8, NULL, 0),
(66, 29, NULL, 'Portal ciudadano - Tarea 6', 'Realizar pruebas de usabilidad con usuarios reales.', '2025-05-11', '2025-05-15', 6, 'pendiente', 11, NULL, 0),
(67, 29, NULL, 'Portal ciudadano - Tarea 7', 'Optimizar tiempos de carga con lazy loading.', '2025-05-13', '2025-05-15', 4, 'pendiente', 2, NULL, 0),
(68, 29, NULL, 'Portal ciudadano - Tarea 8', 'Implementar cache CDN para contenido estático.', '2025-05-15', '2025-05-18', 12, 'pendiente', 5, NULL, 0),
(69, 29, NULL, 'Portal ciudadano - Tarea 9', 'Desarrollar versión responsive para dispositivos móviles.', '2025-05-17', '2025-05-22', 6, 'pendiente', 11, NULL, 0),
(70, 29, NULL, 'Portal ciudadano - Tarea 10', 'Documentar guía de estilos y componentes reutilizables.', '2025-05-19', '2025-05-21', 8, 'pendiente', 7, NULL, 0),
(71, 30, NULL, 'Presupuestos participativos - Tarea 1', 'Definir modelo de datos para iniciativas ciudadanas.', '2025-05-12', '2025-05-15', 6, 'pendiente', 6, NULL, 0),
(72, 30, NULL, 'Presupuestos participativos - Tarea 2', 'Implementar flujo de registro y votación segura.', '2025-05-14', '2025-05-16', 12, 'pendiente', 8, NULL, 0),
(73, 30, NULL, 'Presupuestos participativos - Tarea 3', 'Configurar firma digital para participantes.', '2025-05-16', '2025-05-19', 6, 'pendiente', 7, NULL, 0),
(74, 30, NULL, 'Presupuestos participativos - Tarea 4', 'Desarrollar panel de administración de propuestas.', '2025-05-18', '2025-05-20', 4, 'pendiente', 11, NULL, 0),
(75, 30, NULL, 'Presupuestos participativos - Tarea 5', 'Generar reportes estadísticos en tiempo real.', '2025-05-20', '2025-05-24', 6, 'pendiente', 2, NULL, 0),
(76, 30, NULL, 'Presupuestos participativos - Tarea 6', 'Integrar notificaciones por correo y SMS.', '2025-05-22', '2025-05-24', 12, 'pendiente', 3, NULL, 0),
(77, 30, NULL, 'Presupuestos participativos - Tarea 7', 'Diseñar API pública para datos abiertos.', '2025-05-24', '2025-05-27', 12, 'pendiente', 4, NULL, 0),
(78, 30, NULL, 'Presupuestos participativos - Tarea 8', 'Realizar auditoría de seguridad al sistema de votos.', '2025-05-26', '2025-05-30', 12, 'pendiente', 2, NULL, 0),
(79, 30, NULL, 'Presupuestos participativos - Tarea 9', 'Crear landing page informativa sobre el proceso.', '2025-05-28', '2025-06-02', 4, 'pendiente', 11, NULL, 0),
(80, 30, NULL, 'Presupuestos participativos - Tarea 10', 'Documentar manual de consulta de resultados.', '2025-05-30', '2025-06-04', 12, 'pendiente', 2, NULL, 0),
(81, 31, NULL, 'Identidad digital - Tarea 1', 'Analizar normativas eIDAS para el componente de identidad.', '2025-05-22', '2025-05-24', 12, 'pendiente', 7, NULL, 0),
(82, 31, NULL, 'Identidad digital - Tarea 2', 'Diseñar esquema cifrado de credenciales descentralizadas.', '2025-05-24', '2025-05-27', 8, 'pendiente', 4, NULL, 0),
(83, 31, NULL, 'Identidad digital - Tarea 3', 'Implementar wallet digital con verificación biométrica.', '2025-05-26', '2025-05-29', 12, 'pendiente', 5, NULL, 0),
(84, 31, NULL, 'Identidad digital - Tarea 4', 'Configurar servidor de emisión de certificados.', '2025-05-28', '2025-06-02', 4, 'pendiente', 10, NULL, 0),
(85, 31, NULL, 'Identidad digital - Tarea 5', 'Desarrollar API para verificación de identidad.', '2025-05-30', '2025-06-02', 4, 'pendiente', 6, NULL, 0),
(86, 31, NULL, 'Identidad digital - Tarea 6', 'Realizar pruebas de interoperabilidad con proveedores externos.', '2025-06-01', '2025-06-03', 12, 'pendiente', 3, NULL, 0),
(87, 31, NULL, 'Identidad digital - Tarea 7', 'Optimizar algoritmo de matching de atributos.', '2025-06-03', '2025-06-06', 12, 'pendiente', 1, NULL, 0),
(88, 31, NULL, 'Identidad digital - Tarea 8', 'Integrar autenticación multifactor con FIDO2.', '2025-06-05', '2025-06-07', 6, 'pendiente', 2, NULL, 0),
(89, 31, NULL, 'Identidad digital - Tarea 9', 'Crear guía de integración para terceros.', '2025-06-07', '2025-06-11', 12, 'pendiente', 4, NULL, 0),
(90, 31, NULL, 'Identidad digital - Tarea 10', 'Redactar políticas de privacidad y consentimiento.', '2025-06-09', '2025-06-13', 4, 'pendiente', 3, NULL, 0),
(91, 32, NULL, 'Historial clínico electrónico - Tarea 1', 'Diseñar base de datos HL7 FHIR para registros médicos.', '2025-05-01', '2025-05-04', 8, 'pendiente', 2, NULL, 0),
(92, 32, NULL, 'Historial clínico electrónico - Tarea 2', 'Implementar importación de historiales desde sistemas legacy.', '2025-05-03', '2025-05-08', 8, 'pendiente', 6, NULL, 0),
(93, 32, NULL, 'Historial clínico electrónico - Tarea 3', 'Desarrollar módulo de prescripciones electrónicas.', '2025-05-05', '2025-05-07', 6, 'pendiente', 2, NULL, 0),
(94, 32, NULL, 'Historial clínico electrónico - Tarea 4', 'Configurar control de acceso basado en roles clínicos.', '2025-05-07', '2025-05-10', 8, 'pendiente', 2, NULL, 0),
(95, 32, NULL, 'Historial clínico electrónico - Tarea 5', 'Crear auditoría de acceso para cumplimiento HIPAA.', '2025-05-09', '2025-05-12', 8, 'pendiente', 3, NULL, 0),
(96, 32, NULL, 'Historial clínico electrónico - Tarea 6', 'Optimizar consultas para búsquedas de pacientes.', '2025-05-11', '2025-05-13', 8, 'pendiente', 7, NULL, 0),
(97, 32, NULL, 'Historial clínico electrónico - Tarea 7', 'Desarrollar API para dispositivos de monitoreo remoto.', '2025-05-13', '2025-05-17', 8, 'pendiente', 7, NULL, 0),
(98, 32, NULL, 'Historial clínico electrónico - Tarea 8', 'Implementar backups automáticos cifrados.', '2025-05-15', '2025-05-17', 6, 'pendiente', 7, NULL, 0),
(99, 32, NULL, 'Historial clínico electrónico - Tarea 9', 'Configurar observabilidad con Prometheus y Grafana.', '2025-05-17', '2025-05-19', 8, 'pendiente', 10, NULL, 0),
(100, 32, NULL, 'Historial clínico electrónico - Tarea 10', 'Documentar interfaces de interoperabilidad con laboratorios.', '2025-05-19', '2025-05-24', 4, 'pendiente', 10, NULL, 0),
(101, 33, NULL, 'Agenda médica inteligente - Tarea 1', 'Levantar requerimientos de agendamiento inteligente.', '2025-05-14', '2025-05-19', 4, 'pendiente', 11, NULL, 0),
(102, 33, NULL, 'Agenda médica inteligente - Tarea 2', 'Implementar algoritmo de slots de cita optimizados.', '2025-05-16', '2025-05-19', 4, 'pendiente', 4, NULL, 0),
(103, 33, NULL, 'Agenda médica inteligente - Tarea 3', 'Integrar recordatorios vía push y SMS a pacientes.', '2025-05-18', '2025-05-20', 12, 'pendiente', 8, NULL, 0),
(104, 33, NULL, 'Agenda médica inteligente - Tarea 4', 'Desarrollar panel de disponibilidad para médicos.', '2025-05-20', '2025-05-24', 8, 'pendiente', 11, NULL, 0),
(105, 33, NULL, 'Agenda médica inteligente - Tarea 5', 'Configurar reglas de prioridad para urgencias.', '2025-05-22', '2025-05-25', 4, 'pendiente', 6, NULL, 0),
(106, 33, NULL, 'Agenda médica inteligente - Tarea 6', 'Entrenar modelo de predicción de ausentismo.', '2025-05-24', '2025-05-27', 12, 'pendiente', 10, NULL, 0),
(107, 33, NULL, 'Agenda médica inteligente - Tarea 7', 'Desplegar servicio de recomendación de agenda en la nube.', '2025-05-26', '2025-05-28', 4, 'pendiente', 11, NULL, 0),
(108, 33, NULL, 'Agenda médica inteligente - Tarea 8', 'Realizar pruebas de carga con 10k usuarios simultáneos.', '2025-05-28', '2025-05-31', 12, 'pendiente', 1, NULL, 0),
(109, 33, NULL, 'Agenda médica inteligente - Tarea 9', 'Instrumentar métricas clave de uso de la agenda.', '2025-05-30', '2025-06-03', 6, 'pendiente', 7, NULL, 0),
(110, 33, NULL, 'Agenda médica inteligente - Tarea 10', 'Documentar flujo de alta de nuevos consultorios.', '2025-06-01', '2025-06-05', 12, 'pendiente', 1, NULL, 0),
(111, 34, NULL, 'Telemedicina avanzada - Tarea 1', 'Migrar servicios de video consulta a microservicios.', '2025-05-25', '2025-05-28', 6, 'pendiente', 1, NULL, 0),
(112, 34, NULL, 'Telemedicina avanzada - Tarea 2', 'Implementar codificación adaptativa WebRTC.', '2025-05-27', '2025-05-29', 8, 'pendiente', 8, NULL, 0),
(113, 34, NULL, 'Telemedicina avanzada - Tarea 3', 'Desarrollar módulo de recetas electrónicas post-consulta.', '2025-05-29', '2025-06-01', 8, 'pendiente', 2, NULL, 0),
(114, 34, NULL, 'Telemedicina avanzada - Tarea 4', 'Configurar escalabilidad automática en cluster Kubernetes.', '2025-05-31', '2025-06-04', 12, 'pendiente', 1, NULL, 0),
(115, 34, NULL, 'Telemedicina avanzada - Tarea 5', 'Integrar pagos electrónicos para consultas privadas.', '2025-06-02', '2025-06-05', 4, 'pendiente', 3, NULL, 0),
(116, 34, NULL, 'Telemedicina avanzada - Tarea 6', 'Optimizar latencia de streaming a menos de 300 ms.', '2025-06-04', '2025-06-06', 4, 'pendiente', 2, NULL, 0),
(117, 34, NULL, 'Telemedicina avanzada - Tarea 7', 'Añadir traducción simultánea asistida por IA.', '2025-06-06', '2025-06-08', 8, 'pendiente', 7, NULL, 0),
(118, 34, NULL, 'Telemedicina avanzada - Tarea 8', 'Implementar seguimiento de signos vitales en tiempo real.', '2025-06-08', '2025-06-11', 8, 'pendiente', 1, NULL, 0),
(119, 34, NULL, 'Telemedicina avanzada - Tarea 9', 'Cumplir requisitos GDPR en almacenamiento de grabaciones.', '2025-06-10', '2025-06-14', 8, 'pendiente', 2, NULL, 0),
(120, 34, NULL, 'Telemedicina avanzada - Tarea 10', 'Crear guía de buenas prácticas para profesionales de salud.', '2025-06-12', '2025-06-14', 6, 'pendiente', 5, NULL, 0),
(121, 35, NULL, 'Campus virtual - Tarea 1', 'Diseñar estructura de cursos y módulos interactivos.', '2025-05-01', '2025-05-05', 6, 'pendiente', 10, NULL, 0),
(122, 35, NULL, 'Campus virtual - Tarea 2', 'Implementar sistema SCORM para contenidos.', '2025-05-03', '2025-05-05', 12, 'pendiente', 7, NULL, 0),
(123, 35, NULL, 'Campus virtual - Tarea 3', 'Crear motor de exámenes con calificación automática.', '2025-05-05', '2025-05-07', 12, 'pendiente', 1, NULL, 0),
(124, 35, NULL, 'Campus virtual - Tarea 4', 'Integrar videoconferencias con integración LTI.', '2025-05-07', '2025-05-11', 8, 'pendiente', 1, NULL, 0),
(125, 35, NULL, 'Campus virtual - Tarea 5', 'Configurar analítica de participación de estudiantes.', '2025-05-09', '2025-05-14', 8, 'pendiente', 1, NULL, 0),
(126, 35, NULL, 'Campus virtual - Tarea 6', 'Desarrollar chat en tiempo real para aulas virtuales.', '2025-05-11', '2025-05-15', 4, 'pendiente', 5, NULL, 0),
(127, 35, NULL, 'Campus virtual - Tarea 7', 'Optimizar rendimiento del LMS bajo alta concurrencia.', '2025-05-13', '2025-05-18', 12, 'pendiente', 4, NULL, 0),
(128, 35, NULL, 'Campus virtual - Tarea 8', 'Actualizar tema visual accesible para daltónicos.', '2025-05-15', '2025-05-20', 12, 'pendiente', 7, NULL, 0),
(129, 35, NULL, 'Campus virtual - Tarea 9', 'Implementar pago por cursos certificados.', '2025-05-17', '2025-05-20', 12, 'pendiente', 6, NULL, 0),
(130, 35, NULL, 'Campus virtual - Tarea 10', 'Documentar API para apps móviles de estudiantes.', '2025-05-19', '2025-05-24', 6, 'pendiente', 1, NULL, 0),
(131, 36, NULL, 'Evaluación digital - Tarea 1', 'Definir rubricas y criterios de evaluación digitales.', '2025-05-13', '2025-05-16', 8, 'pendiente', 10, NULL, 0),
(132, 36, NULL, 'Evaluación digital - Tarea 2', 'Desarrollar generador de pruebas adaptativas.', '2025-05-15', '2025-05-17', 8, 'pendiente', 2, NULL, 0),
(133, 36, NULL, 'Evaluación digital - Tarea 3', 'Integrar servicio de proctoring con IA.', '2025-05-17', '2025-05-21', 4, 'pendiente', 3, NULL, 0),
(134, 36, NULL, 'Evaluación digital - Tarea 4', 'Configurar almacenamiento seguro de respuestas.', '2025-05-19', '2025-05-22', 4, 'pendiente', 3, NULL, 0),
(135, 36, NULL, 'Evaluación digital - Tarea 5', 'Crear dashboard de resultados para docentes.', '2025-05-21', '2025-05-23', 12, 'pendiente', 5, NULL, 0),
(136, 36, NULL, 'Evaluación digital - Tarea 6', 'Implementar firma electrónica de actas.', '2025-05-23', '2025-05-28', 6, 'pendiente', 11, NULL, 0),
(137, 36, NULL, 'Evaluación digital - Tarea 7', 'Realizar pruebas de estrés sobre el motor de notas.', '2025-05-25', '2025-05-27', 12, 'pendiente', 5, NULL, 0),
(138, 36, NULL, 'Evaluación digital - Tarea 8', 'Generar reportes de desempeño institucional.', '2025-05-27', '2025-05-31', 8, 'pendiente', 8, NULL, 0),
(139, 36, NULL, 'Evaluación digital - Tarea 9', 'Optimizar consultas del módulo de analítica.', '2025-05-29', '2025-05-31', 4, 'pendiente', 4, NULL, 0),
(140, 36, NULL, 'Evaluación digital - Tarea 10', 'Documentar lineamientos de accesibilidad en evaluaciones.', '2025-05-31', '2025-06-04', 4, 'pendiente', 10, NULL, 0),
(141, 37, NULL, 'Sistema de tutorías - Tarea 1', 'Modelar esquema de tutores, tutorandos y sesiones.', '2025-05-24', '2025-05-27', 4, 'pendiente', 8, NULL, 0),
(142, 37, NULL, 'Sistema de tutorías - Tarea 2', 'Desarrollar buscador de tutores por especialidad.', '2025-05-26', '2025-05-31', 6, 'pendiente', 5, NULL, 0),
(143, 37, NULL, 'Sistema de tutorías - Tarea 3', 'Implementar recomendador de contenido personalizable.', '2025-05-28', '2025-05-30', 8, 'pendiente', 5, NULL, 0),
(144, 37, NULL, 'Sistema de tutorías - Tarea 4', 'Configurar calendario compartido y recordatorios.', '2025-05-30', '2025-06-03', 8, 'pendiente', 5, NULL, 0),
(145, 37, NULL, 'Sistema de tutorías - Tarea 5', 'Crear sistema de feedback post‑sesión.', '2025-06-01', '2025-06-03', 4, 'pendiente', 4, NULL, 0),
(146, 37, NULL, 'Sistema de tutorías - Tarea 6', 'Integrar videollamadas seguras en la plataforma.', '2025-06-03', '2025-06-05', 6, 'pendiente', 11, NULL, 0),
(147, 37, NULL, 'Sistema de tutorías - Tarea 7', 'Configurar métricas de éxito y alerta temprana.', '2025-06-05', '2025-06-08', 8, 'pendiente', 10, NULL, 0),
(148, 37, NULL, 'Sistema de tutorías - Tarea 8', 'Optimizar experiencia móvil en Android e iOS.', '2025-06-07', '2025-06-12', 4, 'pendiente', 8, NULL, 0),
(149, 37, NULL, 'Sistema de tutorías - Tarea 9', 'Desarrollar API pública para apps de terceros.', '2025-06-09', '2025-06-11', 6, 'pendiente', 1, NULL, 0),
(150, 37, NULL, 'Sistema de tutorías - Tarea 10', 'Documentar procesos de onboarding de tutores.', '2025-06-11', '2025-06-16', 4, 'pendiente', 8, NULL, 0),
(151, 38, NULL, 'Gestión de flotas - Tarea 1', 'Recolectar telemetría de vehículos vía OBD‑II.', '2025-05-01', '2025-05-03', 8, 'pendiente', 2, NULL, 0),
(152, 38, NULL, 'Gestión de flotas - Tarea 2', 'Implementar algoritmo de rutas óptimas.', '2025-05-03', '2025-05-05', 6, 'pendiente', 5, NULL, 0),
(153, 38, NULL, 'Gestión de flotas - Tarea 3', 'Desarrollar panel de geolocalización en tiempo real.', '2025-05-05', '2025-05-10', 12, 'pendiente', 2, NULL, 0),
(154, 38, NULL, 'Gestión de flotas - Tarea 4', 'Configurar alertas de mantenimiento preventivo.', '2025-05-07', '2025-05-11', 4, 'pendiente', 6, NULL, 0),
(155, 38, NULL, 'Gestión de flotas - Tarea 5', 'Integrar pasarela de pagos para peajes automáticos.', '2025-05-09', '2025-05-11', 12, 'pendiente', 4, NULL, 0),
(156, 38, NULL, 'Gestión de flotas - Tarea 6', 'Realizar pruebas de cobertura en zonas rurales.', '2025-05-11', '2025-05-16', 4, 'pendiente', 11, NULL, 0),
(157, 38, NULL, 'Gestión de flotas - Tarea 7', 'Optimizar compresión de datos enviados por 4G.', '2025-05-13', '2025-05-18', 8, 'pendiente', 7, NULL, 0),
(158, 38, NULL, 'Gestión de flotas - Tarea 8', 'Crear reporte de huella de carbono por trayecto.', '2025-05-15', '2025-05-18', 8, 'pendiente', 5, NULL, 0),
(159, 38, NULL, 'Gestión de flotas - Tarea 9', 'Establecer políticas de seguridad para conductores.', '2025-05-17', '2025-05-20', 8, 'pendiente', 6, NULL, 0),
(160, 38, NULL, 'Gestión de flotas - Tarea 10', 'Documentar API de integración con ERP logístico.', '2025-05-19', '2025-05-24', 4, 'pendiente', 5, NULL, 0),
(161, 39, NULL, 'Trazabilidad de envíos - Tarea 1', 'Diseñar modelo de seguimiento punto a punto de paquetes.', '2025-05-16', '2025-05-20', 8, 'pendiente', 8, NULL, 0),
(162, 39, NULL, 'Trazabilidad de envíos - Tarea 2', 'Integrar código QR y escáner móvil.', '2025-05-18', '2025-05-21', 6, 'pendiente', 8, NULL, 0),
(163, 39, NULL, 'Trazabilidad de envíos - Tarea 3', 'Implementar notificaciones push del estado del envío.', '2025-05-20', '2025-05-23', 4, 'pendiente', 10, NULL, 0),
(164, 39, NULL, 'Trazabilidad de envíos - Tarea 4', 'Crear algoritmo ETA basado en tráfico en tiempo real.', '2025-05-22', '2025-05-25', 12, 'pendiente', 5, NULL, 0),
(165, 39, NULL, 'Trazabilidad de envíos - Tarea 5', 'Desarrollar servicio de devolución y reclamos.', '2025-05-24', '2025-05-28', 6, 'pendiente', 8, NULL, 0),
(166, 39, NULL, 'Trazabilidad de envíos - Tarea 6', 'Optimizar base de datos para consultas masivas.', '2025-05-26', '2025-05-31', 12, 'pendiente', 2, NULL, 0),
(167, 39, NULL, 'Trazabilidad de envíos - Tarea 7', 'Implementar blockchain para asegurar trazabilidad.', '2025-05-28', '2025-05-31', 6, 'pendiente', 10, NULL, 0),
(168, 39, NULL, 'Trazabilidad de envíos - Tarea 8', 'Configurar panel de geovallas y alertas.', '2025-05-30', '2025-06-01', 4, 'pendiente', 1, NULL, 0),
(169, 39, NULL, 'Trazabilidad de envíos - Tarea 9', 'Realizar pruebas de carga con 1M paquetes.', '2025-06-01', '2025-06-04', 4, 'pendiente', 2, NULL, 0),
(170, 39, NULL, 'Trazabilidad de envíos - Tarea 10', 'Documentar APIs para operadores logísticos.', '2025-06-03', '2025-06-08', 6, 'pendiente', 2, NULL, 0),
(171, 40, NULL, 'Almacén inteligente - Tarea 1', 'Levantar layout del almacén y zonas de picking.', '2025-05-27', '2025-05-31', 4, 'pendiente', 5, NULL, 0),
(172, 40, NULL, 'Almacén inteligente - Tarea 2', 'Implementar sistema de ubicación por RFID.', '2025-05-29', '2025-06-01', 6, 'pendiente', 3, NULL, 0),
(173, 40, NULL, 'Almacén inteligente - Tarea 3', 'Desarrollar algoritmo de slotting dinámico.', '2025-05-31', '2025-06-03', 8, 'pendiente', 2, NULL, 0),
(174, 40, NULL, 'Almacén inteligente - Tarea 4', 'Configurar robots AMR para transporte interno.', '2025-06-02', '2025-06-07', 8, 'pendiente', 2, NULL, 0),
(175, 40, NULL, 'Almacén inteligente - Tarea 5', 'Integrar sistema WMS con SAP.', '2025-06-04', '2025-06-09', 6, 'pendiente', 2, NULL, 0),
(176, 40, NULL, 'Almacén inteligente - Tarea 6', 'Diseñar tablero de indicadores de eficiencia.', '2025-06-06', '2025-06-11', 12, 'pendiente', 6, NULL, 0),
(177, 40, NULL, 'Almacén inteligente - Tarea 7', 'Optimizar rutas de picking para reducir tiempos.', '2025-06-08', '2025-06-11', 6, 'pendiente', 5, NULL, 0),
(178, 40, NULL, 'Almacén inteligente - Tarea 8', 'Configurar sensores IoT para temperatura y humedad.', '2025-06-10', '2025-06-13', 8, 'pendiente', 7, NULL, 0),
(179, 40, NULL, 'Almacén inteligente - Tarea 9', 'Implementar módulo de inventario cíclico automatizado.', '2025-06-12', '2025-06-17', 6, 'pendiente', 1, NULL, 0),
(180, 40, NULL, 'Almacén inteligente - Tarea 10', 'Generar manual operativo para operarios.', '2025-06-14', '2025-06-16', 8, 'pendiente', 7, NULL, 0),
(181, 41, NULL, 'Evaluación automática de siniestros - Tarea 1', 'Recolectar dataset de siniestros y categorizar tipologías.', '2025-05-01', '2025-05-05', 8, 'pendiente', 5, NULL, 0),
(182, 41, NULL, 'Evaluación automática de siniestros - Tarea 2', 'Entrenar modelo de visión por computadora para daños.', '2025-05-03', '2025-05-06', 4, 'pendiente', 6, NULL, 0),
(183, 41, NULL, 'Evaluación automática de siniestros - Tarea 3', 'Integrar OCR para captura de documentos.', '2025-05-05', '2025-05-10', 4, 'pendiente', 10, NULL, 0),
(184, 41, NULL, 'Evaluación automática de siniestros - Tarea 4', 'Desarrollar flujo de aprobación automática según reglas.', '2025-05-07', '2025-05-11', 12, 'pendiente', 1, NULL, 0),
(185, 41, NULL, 'Evaluación automática de siniestros - Tarea 5', 'Configurar API de pago de indemnizaciones.', '2025-05-09', '2025-05-14', 4, 'pendiente', 6, NULL, 0),
(186, 41, NULL, 'Evaluación automática de siniestros - Tarea 6', 'Crear dashboard de KPIs de siniestralidad.', '2025-05-11', '2025-05-15', 6, 'pendiente', 7, NULL, 0),
(187, 41, NULL, 'Evaluación automática de siniestros - Tarea 7', 'Implementar controles antifraude en declaraciones.', '2025-05-13', '2025-05-16', 12, 'pendiente', 4, NULL, 0),
(188, 41, NULL, 'Evaluación automática de siniestros - Tarea 8', 'Automatizar generación de informes para regulador.', '2025-05-15', '2025-05-17', 4, 'pendiente', 7, NULL, 0),
(189, 41, NULL, 'Evaluación automática de siniestros - Tarea 9', 'Optimizar tiempos de respuesta del motor de reglas.', '2025-05-17', '2025-05-22', 4, 'pendiente', 3, NULL, 0),
(190, 41, NULL, 'Evaluación automática de siniestros - Tarea 10', 'Documentar proceso de atención digital.', '2025-05-19', '2025-05-23', 8, 'pendiente', 8, NULL, 0),
(191, 42, NULL, 'App de pólizas - Tarea 1', 'Diseñar flujo de emisión de pólizas en la app.', '2025-05-11', '2025-05-13', 8, 'pendiente', 11, NULL, 0),
(192, 42, NULL, 'App de pólizas - Tarea 2', 'Implementar firma biométrica del asegurado.', '2025-05-13', '2025-05-16', 6, 'pendiente', 1, NULL, 0),
(193, 42, NULL, 'App de pólizas - Tarea 3', 'Desarrollar módulo de consulta de cobertura en tiempo real.', '2025-05-15', '2025-05-19', 8, 'pendiente', 10, NULL, 0),
(194, 42, NULL, 'App de pólizas - Tarea 4', 'Configurar pasarela de pago de primas.', '2025-05-17', '2025-05-20', 12, 'pendiente', 4, NULL, 0),
(195, 42, NULL, 'App de pólizas - Tarea 5', 'Integrar chat de asistencia 24/7.', '2025-05-19', '2025-05-23', 8, 'pendiente', 8, NULL, 0),
(196, 42, NULL, 'App de pólizas - Tarea 6', 'Optimizar almacenamiento offline de pólizas.', '2025-05-21', '2025-05-24', 8, 'pendiente', 2, NULL, 0),
(197, 42, NULL, 'App de pólizas - Tarea 7', 'Implementar recordatorios de vencimiento.', '2025-05-23', '2025-05-27', 4, 'pendiente', 2, NULL, 0),
(198, 42, NULL, 'App de pólizas - Tarea 8', 'Crear sistema de recomendaciones personalizadas.', '2025-05-25', '2025-05-30', 12, 'pendiente', 8, NULL, 0),
(199, 42, NULL, 'App de pólizas - Tarea 9', 'Realizar pruebas de accesibilidad WCAG 2.1.', '2025-05-27', '2025-05-29', 12, 'pendiente', 10, NULL, 0),
(200, 42, NULL, 'App de pólizas - Tarea 10', 'Documentar guía de usuario y FAQ.', '2025-05-29', '2025-06-03', 4, 'pendiente', 6, NULL, 0),
(201, 43, NULL, 'Chatbot de soporte - Tarea 1', 'Diseñar intents y entidades base del chatbot.', '2025-05-23', '2025-05-25', 12, 'pendiente', 7, NULL, 0),
(202, 43, NULL, 'Chatbot de soporte - Tarea 2', 'Entrenar modelo NLP multilingüe.', '2025-05-25', '2025-05-30', 12, 'pendiente', 6, NULL, 0),
(203, 43, NULL, 'Chatbot de soporte - Tarea 3', 'Integrar chatbot con sistemas internos de tickets.', '2025-05-27', '2025-06-01', 12, 'pendiente', 6, NULL, 0),
(204, 43, NULL, 'Chatbot de soporte - Tarea 4', 'Configurar fallback humano y escalamiento.', '2025-05-29', '2025-06-02', 4, 'pendiente', 4, NULL, 0),
(205, 43, NULL, 'Chatbot de soporte - Tarea 5', 'Analizar conversaciones y mejorar base de conocimiento.', '2025-05-31', '2025-06-05', 4, 'pendiente', 2, NULL, 0),
(206, 43, NULL, 'Chatbot de soporte - Tarea 6', 'Desplegar chatbot en WhatsApp y web.', '2025-06-02', '2025-06-07', 4, 'pendiente', 11, NULL, 0),
(207, 43, NULL, 'Chatbot de soporte - Tarea 7', 'Implementar reconocimiento de voz a texto.', '2025-06-04', '2025-06-08', 12, 'pendiente', 4, NULL, 0),
(208, 43, NULL, 'Chatbot de soporte - Tarea 8', 'Agregar recomendaciones basadas en historial de usuario.', '2025-06-06', '2025-06-10', 8, 'pendiente', 10, NULL, 0),
(209, 43, NULL, 'Chatbot de soporte - Tarea 9', 'Monitorizar métricas de satisfacción del chat.', '2025-06-08', '2025-06-10', 12, 'pendiente', 5, NULL, 0),
(210, 43, NULL, 'Chatbot de soporte - Tarea 10', 'Documentar API de integración con CRM.', '2025-06-10', '2025-06-15', 6, 'pendiente', 11, NULL, 0),
(211, 44, NULL, 'Smart Metering - Tarea 1', 'Instalar medidores inteligentes piloto en 100 hogares.', '2025-05-01', '2025-05-06', 12, 'pendiente', 10, NULL, 0),
(212, 44, NULL, 'Smart Metering - Tarea 2', 'Implementar protocolo DLMS/COSEM en gateways.', '2025-05-03', '2025-05-08', 6, 'pendiente', 5, NULL, 0),
(213, 44, NULL, 'Smart Metering - Tarea 3', 'Desarrollar dashboard de consumo energético.', '2025-05-05', '2025-05-07', 6, 'pendiente', 11, NULL, 0),
(214, 44, NULL, 'Smart Metering - Tarea 4', 'Configurar encriptación de datos de medición.', '2025-05-07', '2025-05-09', 4, 'pendiente', 1, NULL, 0),
(215, 44, NULL, 'Smart Metering - Tarea 5', 'Crear sistema de facturación en tiempo real.', '2025-05-09', '2025-05-11', 6, 'pendiente', 4, NULL, 0),
(216, 44, NULL, 'Smart Metering - Tarea 6', 'Integrar soporte para energía solar bidireccional.', '2025-05-11', '2025-05-13', 8, 'pendiente', 8, NULL, 0),
(217, 44, NULL, 'Smart Metering - Tarea 7', 'Optimizar comunicaciones MQTT para baja latencia.', '2025-05-13', '2025-05-17', 8, 'pendiente', 2, NULL, 0),
(218, 44, NULL, 'Smart Metering - Tarea 8', 'Realizar pruebas de interoperabilidad con dispositivos de terceros.', '2025-05-15', '2025-05-20', 4, 'pendiente', 11, NULL, 0),
(219, 44, NULL, 'Smart Metering - Tarea 9', 'Desarrollar módulo de alertas de consumo anómalo.', '2025-05-17', '2025-05-21', 4, 'pendiente', 11, NULL, 0),
(220, 44, NULL, 'Smart Metering - Tarea 10', 'Documentar políticas de privacidad de datos de usuarios.', '2025-05-19', '2025-05-23', 6, 'pendiente', 3, NULL, 0),
(221, 45, NULL, 'Gestión de red inteligente - Tarea 1', 'Levantar inventario de activos de red eléctrica.', '2025-05-17', '2025-05-19', 6, 'pendiente', 2, NULL, 0),
(222, 45, NULL, 'Gestión de red inteligente - Tarea 2', 'Implementar sistema SCADA para líneas de distribución.', '2025-05-19', '2025-05-23', 6, 'pendiente', 10, NULL, 0),
(223, 45, NULL, 'Gestión de red inteligente - Tarea 3', 'Desarrollar algoritmo de balance de carga dinámico.', '2025-05-21', '2025-05-26', 12, 'pendiente', 10, NULL, 0),
(224, 45, NULL, 'Gestión de red inteligente - Tarea 4', 'Configurar redundancia y failover en centros de control.', '2025-05-23', '2025-05-27', 8, 'pendiente', 3, NULL, 0),
(225, 45, NULL, 'Gestión de red inteligente - Tarea 5', 'Integrar sistema de predicción de demanda con IA.', '2025-05-25', '2025-05-27', 8, 'pendiente', 5, NULL, 0),
(226, 45, NULL, 'Gestión de red inteligente - Tarea 6', 'Realizar pruebas de contingencia y recuperación.', '2025-05-27', '2025-05-29', 6, 'pendiente', 7, NULL, 0),
(227, 45, NULL, 'Gestión de red inteligente - Tarea 7', 'Desplegar sensores PMU para mediciones en tiempo real.', '2025-05-29', '2025-06-02', 4, 'pendiente', 4, NULL, 0),
(228, 45, NULL, 'Gestión de red inteligente - Tarea 8', 'Crear dashboard de estabilidad y frecuencia.', '2025-05-31', '2025-06-04', 8, 'pendiente', 5, NULL, 0),
(229, 45, NULL, 'Gestión de red inteligente - Tarea 9', 'Optimizar latencia en redes de comunicaciones IEC 61850.', '2025-06-02', '2025-06-05', 4, 'pendiente', 6, NULL, 0),
(230, 45, NULL, 'Gestión de red inteligente - Tarea 10', 'Documentar procedimientos operativos estándar.', '2025-06-04', '2025-06-07', 12, 'pendiente', 11, NULL, 0),
(231, 46, NULL, 'App cliente energía - Tarea 1', 'Diseñar interfaz para consulta de consumo y facturas.', '2025-05-28', '2025-06-01', 8, 'pendiente', 11, NULL, 0),
(232, 46, NULL, 'App cliente energía - Tarea 2', 'Implementar login con autenticación social.', '2025-05-30', '2025-06-03', 4, 'pendiente', 4, NULL, 0),
(233, 46, NULL, 'App cliente energía - Tarea 3', 'Desarrollar pago de facturas con Apple Pay/Google Pay.', '2025-06-01', '2025-06-03', 8, 'pendiente', 4, NULL, 0),
(234, 46, NULL, 'App cliente energía - Tarea 4', 'Configurar aviso de cortes programados por push.', '2025-06-03', '2025-06-07', 6, 'pendiente', 9, NULL, 0),
(235, 46, NULL, 'App cliente energía - Tarea 5', 'Añadir comparador de planes tarifarios personalizados.', '2025-06-05', '2025-06-09', 12, 'pendiente', 11, NULL, 0),
(236, 46, NULL, 'App cliente energía - Tarea 6', 'Integrar visualización de generación solar doméstica.', '2025-06-07', '2025-06-12', 12, 'pendiente', 10, NULL, 0),
(237, 46, NULL, 'App cliente energía - Tarea 7', 'Optimizar consumo de batería en la app móvil.', '2025-06-09', '2025-06-11', 12, 'pendiente', 10, NULL, 0),
(238, 46, NULL, 'App cliente energía - Tarea 8', 'Implementar widget de consumo en pantalla de inicio.', '2025-06-11', '2025-06-15', 12, 'pendiente', 8, NULL, 0),
(239, 46, NULL, 'App cliente energía - Tarea 9', 'Crear módulo de soporte vía chat en la app.', '2025-06-13', '2025-06-18', 4, 'pendiente', 7, NULL, 0),
(240, 46, NULL, 'App cliente energía - Tarea 10', 'Documentar flujo de alta de nuevos clientes.', '2025-06-15', '2025-06-18', 6, 'pendiente', 5, NULL, 0),
(241, 47, NULL, 'Marketplace sectorial - Tarea 1', 'Definir categorías y taxonomía de productos del sector.', '2025-05-01', '2025-05-06', 4, 'pendiente', 4, NULL, 0),
(242, 47, NULL, 'Marketplace sectorial - Tarea 2', 'Implementar buscador con auto‑complete.', '2025-05-03', '2025-05-08', 4, 'pendiente', 2, NULL, 0),
(243, 47, NULL, 'Marketplace sectorial - Tarea 3', 'Desarrollar flujo de compra con escrow.', '2025-05-05', '2025-05-10', 6, 'pendiente', 6, NULL, 0),
(244, 47, NULL, 'Marketplace sectorial - Tarea 4', 'Configurar calificaciones y reseñas de vendedores.', '2025-05-07', '2025-05-11', 8, 'pendiente', 9, NULL, 0),
(245, 47, NULL, 'Marketplace sectorial - Tarea 5', 'Integrar pasarela de pagos internacional.', '2025-05-09', '2025-05-11', 12, 'pendiente', 8, NULL, 0),
(246, 47, NULL, 'Marketplace sectorial - Tarea 6', 'Diseñar panel de analytics para vendedores.', '2025-05-11', '2025-05-15', 8, 'pendiente', 11, NULL, 0),
(247, 47, NULL, 'Marketplace sectorial - Tarea 7', 'Optimizar SEO y rendimiento web vitals.', '2025-05-13', '2025-05-15', 8, 'pendiente', 4, NULL, 0),
(248, 47, NULL, 'Marketplace sectorial - Tarea 8', 'Agregar soporte para subastas en tiempo real.', '2025-05-15', '2025-05-18', 8, 'pendiente', 1, NULL, 0),
(249, 47, NULL, 'Marketplace sectorial - Tarea 9', 'Implementar sistema de mensajes internos buyer-seller.', '2025-05-17', '2025-05-19', 8, 'pendiente', 1, NULL, 0),
(250, 47, NULL, 'Marketplace sectorial - Tarea 10', 'Documentar API para integraciones de proveedores.', '2025-05-19', '2025-05-22', 6, 'pendiente', 8, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `id_personal` int(11) NOT NULL,
  `id_tarea` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `horas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id_turno`, `id_personal`, `id_tarea`, `fecha_inicio`, `fecha_fin`, `horas`) VALUES
(1, 1, 5, '2025-05-19', '2025-05-19', 6),
(2, 2, 7, '2025-05-19', '2025-05-20', 10),
(3, 3, 2, '2025-05-21', '2025-05-21', 8),
(4, 4, 12, '2025-05-22', '2025-05-23', 12),
(5, 5, 11, '2025-05-24', '2025-05-24', 4),
(6, 6, 19, '2025-05-24', '2025-05-26', 16),
(7, 7, 14, '2025-05-27', '2025-05-27', 8),
(8, 8, 21, '2025-05-27', '2025-05-29', 20),
(9, 9, 17, '2025-05-30', '2025-05-30', 7),
(10, 10, 13, '2025-06-01', '2025-06-01', 8),
(11, 11, 9, '2025-06-02', '2025-06-04', 18),
(12, 12, 6, '2025-06-05', '2025-06-05', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_empresa` int(10) UNSIGNED NOT NULL,
  `id_departamento` int(10) UNSIGNED DEFAULT NULL,
  `usuario` varchar(60) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('ADMIN','PM','EMP') NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_empresa`, `id_departamento`, `usuario`, `contrasena`, `rol`, `nombre`, `email`, `fecha_alta`) VALUES
(1, 1, NULL, 'admin_tn', '5821', 'ADMIN', 'Carla Ruiz', 'carla@technova.com', '2025-04-26 20:12:09'),
(2, 1, 1, 'pm_dev', '0047', 'PM', 'Luis Gómez', 'luis@technova.com', '2025-04-26 20:12:09'),
(3, 1, 16, 'emp_ana', '9300', 'EMP', 'Ana Pérez', 'ana@technova.com', '2025-04-26 20:12:09'),
(4, 1, 16, 'emp_javier', '7215', 'EMP', 'Javier Santos', 'javier@technova.com', '2025-04-26 20:12:09'),
(5, 1, 2, 'pm_infra', '3184', 'PM', 'Marta León', 'marta@technova.com', '2025-04-26 20:12:09'),
(6, 1, 16, 'emp_ricardo', '8679', 'EMP', 'Ricardo Díaz', 'ricardo@technova.com', '2025-04-26 20:12:09'),
(12, 1, 16, 'emp_maria', '4731', 'EMP', 'María Soto', 'maria@technova.com', '2025-04-26 20:12:09'),
(13, 1, 16, 'emp_sergio', '9120', 'EMP', 'Sergio Peña', 'sergio@technova.com', '2025-04-26 20:12:09'),
(14, 1, 16, 'emp_silvia', '3086', 'EMP', 'Silvia Moreno', 'silvia@technova.com', '2025-04-26 20:12:09'),
(15, 1, 2, 'pm_redes', '1197', 'PM', 'Álvaro Ríos', 'alvaro@technova.com', '2025-04-26 20:12:09'),
(16, 1, 16, 'emp_carmen', '7642', 'EMP', 'Carmen Reyes', 'carmen@technova.com', '2025-04-26 20:12:09'),
(17, 1, 16, 'emp_jorge', '8235', 'EMP', 'Jorge Herrera', 'jorge@technova.com', '2025-04-26 20:12:09'),
(18, 1, 3, 'pm_sistemas', '6514', 'PM', 'Lorena Torres', 'lorena@technova.com', '2025-04-26 20:12:09'),
(20, 1, 6, 'pm_sanidad', '2456', 'PM', 'Natalia Muñoz', 'natalia@technova.com', '2025-04-26 20:12:09'),
(21, 1, 7, 'pm_educacion', '7851', 'PM', 'Eduardo Martín', 'eduardo@technova.com', '2025-04-26 20:12:09'),
(22, 1, 8, 'pm_logistica', '1328', 'PM', 'Beatriz Romero', 'beatriz@technova.com', '2025-04-26 20:12:09'),
(23, 1, 9, 'pm_seguros', '6994', 'PM', 'Héctor Salas', 'hector@technova.com', '2025-04-26 20:12:09'),
(24, 1, 10, 'pm_energia', '5642', 'PM', 'Sonia Delgado', 'sonia@technova.com', '2025-04-26 20:12:09'),
(25, 1, 11, 'pm_retail', '3186', 'PM', 'Iván Ramírez', 'ivan@technova.com', '2025-04-26 20:12:09'),
(26, 1, 12, 'pm_telecom', '4089', 'PM', 'Patricia Lara', 'patricia@technova.com', '2025-04-26 20:12:09'),
(27, 1, 13, 'pm_transporte', '9214', 'PM', 'Tomás Ferrer', 'tomas@technova.com', '2025-04-26 20:12:09'),
(28, 1, 14, 'pm_admin', '3347', 'PM', 'Isabel Cortés', 'isabel@technova.com', '2025-04-26 20:12:09'),
(29, 1, 15, 'pm_finanzas', '6119', 'PM', 'Julián Morales', 'julian@technova.com', '2025-04-26 20:12:09'),
(30, 1, 16, 'emp_lucia', '4578', 'EMP', 'Lucía Varela', 'lucia@technova.com', '2025-06-02 20:12:09'),
(31, 1, 16, 'emp_adrian', '6341', 'EMP', 'Adrián Iglesias', 'adrian@technova.com', '2025-06-02 20:12:09'),
(32, 1, 16, 'emp_nacho', '8129', 'EMP', 'Ignacio Caballero', 'nacho@technova.com', '2025-06-02 20:12:09'),
(33, 1, 16, 'emp_daniela', '2235', 'EMP', 'Daniela Campos', 'daniela@technova.com', '2025-06-02 20:12:09'),
(34, 1, 16, 'emp_oscar', '5408', 'EMP', 'Óscar Lozano', 'oscar@technova.com', '2025-06-02 20:12:09'),
(35, 1, 16, 'emp_ines', '9714', 'EMP', 'Inés Fuentes', 'ines@technova.com', '2025-06-02 20:12:09'),
(36, 1, 16, 'emp_saul', '6843', 'EMP', 'Saúl Molina', 'saul@technova.com', '2025-06-02 20:12:09'),
(37, 1, 16, 'emp_rosa', '3586', 'EMP', 'Rosa Herrera', 'rosa@technova.com', '2025-06-02 20:12:09'),
(38, 1, 16, 'emp_pedro', '1102', 'EMP', 'Pedro Valdés', 'pedro@technova.com', '2025-06-02 20:12:09'),
(39, 1, 16, 'emp_alba', '4927', 'EMP', 'Alba Navarro', 'alba@technova.com', '2025-06-02 20:12:09'),
(40, 1, 16, 'emp_marco', '7594', 'EMP', 'Marco Domínguez', 'marco@technova.com', '2025-06-02 20:12:09'),
(41, 1, 16, 'emp_irene', '3368', 'EMP', 'Irene Roldán', 'irene@technova.com', '2025-06-02 20:12:09'),
(42, 1, 16, 'emp_diego', '5623', 'EMP', 'Diego Campos', 'diego@technova.com', '2025-06-02 20:12:09'),
(43, 1, 16, 'emp_nerea', '8146', 'EMP', 'Nerea Calvo', 'nerea@technova.com', '2025-06-02 20:12:09'),
(44, 1, 16, 'emp_mateo', '2098', 'EMP', 'Mateo Barrera', 'mateo@technova.com', '2025-06-02 20:12:09'),
(45, 1, 16, 'emp_elena', '6741', 'EMP', 'Elena Paredes', 'elena@technova.com', '2025-06-02 20:12:09'),
(46, 1, 16, 'emp_gabriel', '9325', 'EMP', 'Gabriel Ferrero', 'gabriel@technova.com', '2025-06-02 20:12:09'),
(47, 1, 16, 'emp_laia', '3810', 'EMP', 'Laia Romero', 'laia@technova.com', '2025-06-02 20:12:09'),
(48, 1, 16, 'emp_victor', '7542', 'EMP', 'Víctor Cabrera', 'victor@technova.com', '2025-06-02 20:12:09'),
(49, 1, 16, 'emp_sara', '1289', 'EMP', 'Sara Domínguez', 'sara@technova.com', '2025-06-02 20:12:09'),
(50, 1, 16, 'emp_hugo', '4670', 'EMP', 'Hugo Medina', 'hugo@technova.com', '2025-06-02 20:12:09'),
(51, 1, 16, 'emp_ainhoa', '5934', 'EMP', 'Ainhoa Delgado', 'ainhoa@technova.com', '2025-06-02 20:12:09');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  ADD PRIMARY KEY (`id_usuario`,`id_proyecto`),
  ADD KEY `id_proyecto` (`id_proyecto`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`),
  ADD KEY `id_empresa` (`id_empresa`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id_empresa`),
  ADD UNIQUE KEY `cif` (`cif`);

--
-- Indices de la tabla `estimaciones`
--
ALTER TABLE `estimaciones`
  ADD PRIMARY KEY (`id_estimacion`),
  ADD UNIQUE KEY `uk_proyecto_fecha` (`id_proyecto`,`fecha_generada`);

--
-- Indices de la tabla `perfiles`
--
ALTER TABLE `perfiles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `personal`
--
ALTER TABLE `personal`
  ADD PRIMARY KEY (`id_personal`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id_proyecto`),
  ADD KEY `id_departamento` (`id_departamento`),
  ADD KEY `id_jefe_pm` (`id_jefe_pm`);

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tarea_perfil` (`id_perfil`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_empresa` (`id_empresa`),
  ADD KEY `id_departamento` (`id_departamento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id_empresa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `estimaciones`
--
ALTER TABLE `estimaciones`
  MODIFY `id_estimacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `perfiles`
--
ALTER TABLE `perfiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `personal`
--
ALTER TABLE `personal`
  MODIFY `id_personal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id_proyecto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `tareas`
--
ALTER TABLE `tareas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=251;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asignaciones`
--
ALTER TABLE `asignaciones`
  ADD CONSTRAINT `asignaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `asignaciones_ibfk_2` FOREIGN KEY (`id_proyecto`) REFERENCES `proyectos` (`id_proyecto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD CONSTRAINT `departamentos_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON UPDATE CASCADE,
  ADD CONSTRAINT `proyectos_ibfk_2` FOREIGN KEY (`id_jefe_pm`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `fk_tarea_perfil` FOREIGN KEY (`id_perfil`) REFERENCES `perfiles` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`),
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
