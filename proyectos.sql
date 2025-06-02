-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-05-2025 a las 20:03:05
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
(1, 1, 2, 'Plataforma e-commerce', 'Nueva tienda online B2C', '2025-01-15', NULL, 'EN_CURSO'),
(2, 1, 2, 'API pública v2', 'Refactor completo de la API', '2024-11-10', NULL, 'EN_CURSO'),
(3, 2, 5, 'Migración a Kubernetes', 'Dockerización y orquestación', '2024-09-01', NULL, 'PAUSADO'),
(4, 4, 8, 'Auditoría ERP', 'Revisión de procesos – Cliente A', '2025-03-05', NULL, 'EN_CURSO'),
(5, 5, 10, 'Mesa de ayuda 24/7', 'Implantación de ITSM', '2024-12-01', NULL, 'EN_CURSO'),
(17, 1, 2, 'Prueba 2', NULL, '2025-05-01', '2025-05-31', 'EN_CURSO'),
(18, 1, 2, 'Prueba 3', NULL, '2025-06-02', '2025-05-30', 'EN_CURSO'),
(19, 2, 5, 'Prueba 4', NULL, '2025-07-01', '2025-07-31', 'EN_CURSO');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id_proyecto`),
  ADD KEY `id_departamento` (`id_departamento`),
  ADD KEY `id_jefe_pm` (`id_jefe_pm`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id_proyecto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `proyectos_ibfk_1` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON UPDATE CASCADE,
  ADD CONSTRAINT `proyectos_ibfk_2` FOREIGN KEY (`id_jefe_pm`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
