-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Dec 11. 12:34
-- Kiszolgáló verziója: 12.1.2-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `filmrendszer`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `admin`
--

INSERT INTO `admin` (`id`, `user_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ertekeles`
--

CREATE TABLE `ertekeles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `film_id` int(11) NOT NULL,
  `pontszam` int(11) NOT NULL,
  `letrehoz_datum` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `ertekeles`
--

INSERT INTO `ertekeles` (`id`, `user_id`, `guest_id`, `film_id`, `pontszam`, `letrehoz_datum`) VALUES
(1, 1, NULL, 2, 9, NULL),
(2, NULL, 1, 2, 8, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`id`, `nev`, `email`, `jelszo`, `avatar`, `bio`) VALUES
(1, 'Teszt Felhasználó', 'teszt@example.com', 'titkosjelszo', NULL, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `film`
--

CREATE TABLE `film` (
  `id` int(11) NOT NULL,
  `cim` varchar(255) NOT NULL,
  `megjelenesi_ev` int(11) DEFAULT NULL,
  `boritokep_url` varchar(255) DEFAULT NULL,
  `leiras` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `film`
--

INSERT INTO `film` (`id`, `cim`, `megjelenesi_ev`, `boritokep_url`, `leiras`) VALUES
(1, 'Inception', 2010, 'https://example.com/inception.jpg', 'Egy sci-fi thriller.'),
(2, 'Inception', 2010, 'https://example.com/inception.jpg', 'Egy sci-fi thriller.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `komment`
--

CREATE TABLE `komment` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `film_id` int(11) NOT NULL,
  `tartalom` text NOT NULL,
  `letrehoz_datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `komment`
--

INSERT INTO `komment` (`id`, `user_id`, `guest_id`, `film_id`, `tartalom`, `letrehoz_datum`) VALUES
(1, 1, NULL, 2, 'Nagyon tetszett a film!', '2025-12-11 12:32:37'),
(2, NULL, 1, 2, 'Érdekes történet volt.', '2025-12-11 12:32:37');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `listaelem`
--

CREATE TABLE `listaelem` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `film_id` int(11) NOT NULL,
  `status` enum('Megnezendo','Mar_láttam') NOT NULL DEFAULT 'Megnezendo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `listaelem`
--

INSERT INTO `listaelem` (`id`, `user_id`, `guest_id`, `film_id`, `status`) VALUES
(1, 1, NULL, 2, 'Mar_láttam'),
(2, NULL, 1, 2, 'Megnezendo');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `moderaciolog`
--

CREATE TABLE `moderaciolog` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `akcio` varchar(255) NOT NULL,
  `target_user_id` int(11) DEFAULT NULL,
  `target_film_id` int(11) DEFAULT NULL,
  `target_komment_id` int(11) DEFAULT NULL,
  `datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `moderaciolog`
--

INSERT INTO `moderaciolog` (`id`, `admin_id`, `akcio`, `target_user_id`, `target_film_id`, `target_komment_id`, `datum`) VALUES
(1, 1, 'Törölt kommentet', 1, 2, NULL, '2025-12-11 12:32:37');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vendegfelhasznalo`
--

CREATE TABLE `vendegfelhasznalo` (
  `id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `letrehoz_datum` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `vendegfelhasznalo`
--

INSERT INTO `vendegfelhasznalo` (`id`, `session_token`, `letrehoz_datum`) VALUES
(1, 'sess123456', '2025-12-11 12:32:37');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `ertekeles`
--
ALTER TABLE `ertekeles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `film_id` (`film_id`);

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A tábla indexei `film`
--
ALTER TABLE `film`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `komment`
--
ALTER TABLE `komment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `guest_id` (`guest_id`),
  ADD KEY `film_id` (`film_id`);

--
-- A tábla indexei `listaelem`
--
ALTER TABLE `listaelem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `guest_id` (`guest_id`),
  ADD KEY `film_id` (`film_id`);

--
-- A tábla indexei `moderaciolog`
--
ALTER TABLE `moderaciolog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `target_user_id` (`target_user_id`),
  ADD KEY `target_film_id` (`target_film_id`),
  ADD KEY `target_komment_id` (`target_komment_id`);

--
-- A tábla indexei `vendegfelhasznalo`
--
ALTER TABLE `vendegfelhasznalo`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `ertekeles`
--
ALTER TABLE `ertekeles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `film`
--
ALTER TABLE `film`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `komment`
--
ALTER TABLE `komment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `listaelem`
--
ALTER TABLE `listaelem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `moderaciolog`
--
ALTER TABLE `moderaciolog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `vendegfelhasznalo`
--
ALTER TABLE `vendegfelhasznalo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `felhasznalo` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `ertekeles`
--
ALTER TABLE `ertekeles`
  ADD CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `felhasznalo` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `2` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `komment`
--
ALTER TABLE `komment`
  ADD CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `felhasznalo` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `2` FOREIGN KEY (`guest_id`) REFERENCES `vendegfelhasznalo` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `3` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `listaelem`
--
ALTER TABLE `listaelem`
  ADD CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `felhasznalo` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `2` FOREIGN KEY (`guest_id`) REFERENCES `vendegfelhasznalo` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `3` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `moderaciolog`
--
ALTER TABLE `moderaciolog`
  ADD CONSTRAINT `1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `2` FOREIGN KEY (`target_user_id`) REFERENCES `felhasznalo` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `3` FOREIGN KEY (`target_film_id`) REFERENCES `film` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `4` FOREIGN KEY (`target_komment_id`) REFERENCES `komment` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
