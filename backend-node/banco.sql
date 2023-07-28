CREATE DATABASE webserver
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Occurrences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `registered_at` varchar(255) DEFAULT NULL,
  `local` varchar(255) DEFAULT NULL,
  `occurrence_type` int DEFAULT NULL,
  `km` int DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Occurrences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
)