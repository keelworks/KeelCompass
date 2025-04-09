-- MySQL dump 10.13  Distrib 9.2.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: KeelCompass_dev
-- ------------------------------------------------------
-- Server version	9.2.0

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

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Categories_UNIQUE` (`name`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'Education'),(2,'Jobs');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `question_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `comments_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_6` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (1,2,1,'Python is indeed a great choice, but don’t overlook Java for jobs in enterprise solutions.','2024-11-30 07:02:36'),(2,3,2,'If you have experience tutoring or mentoring, it’s worth highlighting those skills.','2024-11-30 07:02:36'),(3,4,3,'Online bootcamps can be helpful for people without formal education in development.','2024-11-30 07:02:36'),(4,5,4,'Networking at local meetups can help you find jobs as a fresher.','2024-11-30 07:02:36'),(5,6,5,'It’s great that teaching opportunities are available; have you looked into private schools?','2024-11-30 07:02:36'),(6,7,6,'Platforms like Coursera have specialized certifications that may help in teaching.','2024-11-30 07:02:36'),(7,8,7,'Transitioning to IT can be daunting, but internships or apprenticeships are a good start.','2024-11-30 07:02:36'),(8,9,8,'I’ve used AngelList before; it’s great for finding startup roles.','2024-11-30 07:02:36'),(9,10,9,'Have you thought about volunteering with an education-focused nonprofit?','2024-11-30 07:02:36'),(10,1,10,'Becoming a Data Scientist often requires strong statistical and machine learning skills.','2024-11-30 07:02:36');
/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Interests`
--

DROP TABLE IF EXISTS `Interests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Interests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `question_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `interests_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `interests_ibfk_6` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Interests`
--

LOCK TABLES `Interests` WRITE;
/*!40000 ALTER TABLE `Interests` DISABLE KEYS */;
INSERT INTO `Interests` VALUES (1,2,1,'2024-11-30 07:04:11'),(2,3,2,'2024-11-30 07:04:11'),(3,4,3,'2024-11-30 07:04:11'),(4,5,4,'2024-11-30 07:04:11'),(5,6,5,'2024-11-30 07:04:11'),(6,7,6,'2024-11-30 07:04:11'),(7,8,7,'2024-11-30 07:04:11'),(8,9,8,'2024-11-30 07:04:11'),(9,10,9,'2024-11-30 07:04:11'),(10,1,10,'2024-11-30 07:04:11');
/*!40000 ALTER TABLE `Interests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QuestionCategories`
--

DROP TABLE IF EXISTS `QuestionCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QuestionCategories` (
  `question_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`question_id`,`category_id`),
  UNIQUE KEY `QuestionCategories_category_id_question_id_unique` (`question_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `questioncategories_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `questioncategories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QuestionCategories`
--

LOCK TABLES `QuestionCategories` WRITE;
/*!40000 ALTER TABLE `QuestionCategories` DISABLE KEYS */;
/*!40000 ALTER TABLE `QuestionCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QuestionCategory`
--

DROP TABLE IF EXISTS `QuestionCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QuestionCategory` (
  `question_d` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`question_d`,`category_id`),
  KEY `QuestionCategory_Categories_FK` (`category_id`),
  CONSTRAINT `QuestionCategory_Categories_FK` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `QuestionCategory_Questions_FK` FOREIGN KEY (`question_d`) REFERENCES `Questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QuestionCategory`
--

LOCK TABLES `QuestionCategory` WRITE;
/*!40000 ALTER TABLE `QuestionCategory` DISABLE KEYS */;
INSERT INTO `QuestionCategory` VALUES (1,1),(3,1),(5,1),(6,1),(9,1),(2,2),(4,2),(7,2),(8,2),(10,2);
/*!40000 ALTER TABLE `QuestionCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Questions`
--

DROP TABLE IF EXISTS `Questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  `status` int DEFAULT NULL,
  `attachment` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Questions`
--

LOCK TABLES `Questions` WRITE;
/*!40000 ALTER TABLE `Questions` DISABLE KEYS */;
INSERT INTO `Questions` VALUES (1,1,'What are the best programming languages for jobs?','I am looking to transition into a programming career. What languages should I focus on?','2024-11-30 06:57:32',0,NULL),(2,2,'How to improve resume for education roles?','What are the key points that make a resume stand out for roles in education?','2024-11-30 06:57:32',0,NULL),(3,3,'Is a degree necessary for software jobs?','Can I land a good software development job without a formal degree?','2024-11-30 06:57:32',0,NULL),(4,4,'What are the best platforms for job preparation?','I want to prepare for job interviews. Are there any specific platforms you recommend?','2024-11-30 06:57:32',0,NULL),(5,5,'How to excel in teaching roles?','I am about to start my career as a teacher. Any tips to excel in this profession?','2024-11-30 06:57:32',0,NULL),(6,6,'What certifications are helpful for education professionals?','Are there any certifications that add value to a career in education?','2024-11-30 06:57:32',0,NULL),(7,7,'How to switch from education to IT jobs?','What are the best steps to move from teaching to IT roles?','2024-11-30 06:57:32',0,NULL),(8,8,'What is the future of remote jobs?','Will remote work continue to grow, and how can I find the best opportunities?','2024-11-30 06:57:32',0,NULL),(9,9,'How to gain experience in the education field?','I am new to the field of education. How can I gain practical experience?','2024-11-30 06:57:32',0,NULL),(10,10,'What are the highest-paying IT jobs?','Can you provide a list of the highest-paying IT roles currently?','2024-11-30 06:57:32',0,NULL);
/*!40000 ALTER TABLE `Questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserQuestionActions`
--

DROP TABLE IF EXISTS `UserQuestionActions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserQuestionActions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `question_id` int NOT NULL,
  `action_type` enum('like','report') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserQuestionActions_UNIQUE` (`user_id`,`question_id`,`action_type`),
  KEY `UserQuestionActions_question_id_IDX` (`question_id`) USING BTREE,
  CONSTRAINT `userquestionactions_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `userquestionactions_ibfk_4` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserQuestionActions`
--

LOCK TABLES `UserQuestionActions` WRITE;
/*!40000 ALTER TABLE `UserQuestionActions` DISABLE KEYS */;
INSERT INTO `UserQuestionActions` VALUES (1,1,1,'like','2024-11-30 07:09:51'),(2,2,1,'report','2024-11-30 07:09:51'),(3,1,2,'like','2024-11-30 07:09:51'),(4,3,2,'like','2024-11-30 07:09:51'),(5,4,3,'report','2024-11-30 07:09:51'),(6,5,4,'like','2024-11-30 07:09:51'),(7,6,5,'report','2024-11-30 07:09:51'),(8,2,6,'like','2024-11-30 07:09:51'),(9,7,7,'like','2024-11-30 07:09:51'),(10,8,8,'report','2024-11-30 07:09:51');
/*!40000 ALTER TABLE `UserQuestionActions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'john_doe','john@example.com','$2b$10$HvX6Fpqk1zxyvZGRv5XSSuvc6bmv5T9N/RXxI6qONHEJ5xapIKgCG','2024-11-30 06:52:37'),(2,'jane_doe','jane@example.com','$2b$10$r.E6GBRr5TufO4Ny89xuJOKMzRNU9QQjOUMzVR/jR2H5VwiOkhA9S','2024-11-30 06:52:37'),(3,'admin_user','admin@example.com','$2b$10$4FVoY6RI7sVZDWny/t4ROeiLxDR49JZc8PAukxTI5/f3VLi93q3X2','2024-11-30 06:52:37'),(4,'alice','alice@example.com','$2b$10$B6Ch8WuQUk4JZsklOBjGWuvEsRD1nqC5WtFlbZTwZCGbwRaDiGp8W','2024-11-30 06:52:37'),(5,'bob','bob@example.com','$2b$10$Fr/OvxnqlvJ7RgR/z8CydOZWZnNz69.gBNskB6bJcHk7Ysk1kx.jK','2024-11-30 06:52:37'),(6,'charlie','charlie@example.com','$2b$10$TK4LBMG.zI7dwR6TkeIQmeDGflP.XRejfFTDQIZWkZz0upnn0fvmG','2024-11-30 06:52:37'),(7,'dave','dave@example.com','$2b$10$yY5fI/x/nP3UgzBxsKTVZu.T1IEwQnOdiQvTSUoWCuIUV6El1rKa6','2024-11-30 06:52:37'),(8,'eve','eve@example.com','$2b$10$OthRVc6rB4Bo3LJnMFZlwO4HNr9Aou0YwiEb06eF9KtMQX8C4zE/C','2024-11-30 06:52:37'),(9,'frank','frank@example.com','$2b$10$ZXJSTezzMPVEUTBfnDQTHuRI.x9y7ub7/F/56HeXpmVpReU1bq22O','2024-11-30 06:52:37'),(10,'grace','grace@example.com','$2b$10$PyJQH.C92mpkJ0FBmAEiuulQdcqMquJG2FQCPM0HTqlV.AJ8zL31S','2024-11-30 06:52:37');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-08 17:30:42
