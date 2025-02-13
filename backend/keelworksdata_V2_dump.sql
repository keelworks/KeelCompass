-- MySQL dump 10.13  Distrib 9.0.1, for macos14 (arm64)
--
-- Host: localhost    Database: KeelCompass
-- ------------------------------------------------------
-- Server version	9.0.1

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
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `question_id` int DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (1,1,1,'I have tried applying for a scholarship at XYZ University, but the process was a bit confusing. Could anyone guide me on the steps to follow?','2024-11-12 06:31:39'),(2,2,2,'I would recommend the \"Data Science Specialization\" by Johns Hopkins University on Coursera. It covers all the basics and is very beginner-friendly.','2024-11-12 06:31:39'),(3,3,3,'Integrating an LMS with a university portal can be challenging, especially when dealing with student data. It would be helpful to use APIs for smooth data exchange between systems.','2024-11-12 06:31:39'),(4,4,4,'To enroll in a machine learning course, I suggest having a basic understanding of Python, linear algebra, and statistics. These are essential for understanding ML algorithms.','2024-11-12 06:31:39'),(5,5,5,'I think tracking the status of scholarship applications through the LMS is a great idea! It could help students stay updated without having to contact the administration.','2024-11-12 06:31:39'),(6,1,5,'I think this is a very interesting question. I would love to see more discussions on this topic.','2024-11-12 04:00:00'),(7,1,7,'Great question! I believe the answer is quite complex, but it would be great to hear others\' opinions.','2024-11-12 04:05:00'),(8,2,1,'This is exactly what I was looking for! It helped me a lot to understand the concept better.','2024-11-12 04:10:00'),(9,2,10,'I disagree with the premise of the question. I think there are other factors to consider.','2024-11-12 04:15:00'),(10,3,3,'This is something I have been thinking about for a while. Can anyone provide more insights?','2024-11-12 04:20:00'),(11,3,15,'Interesting question! I believe there is a different perspective to this, though.','2024-11-12 04:25:00'),(12,4,6,'This topic is quite relevant today. Looking forward to seeing what others have to say about it.','2024-11-12 04:30:00'),(13,4,9,'I have some reservations about this. It would be helpful to clarify a few points.','2024-11-12 04:35:00'),(14,5,8,'I totally agree with the answer. It makes so much sense, especially when you consider X.','2024-11-12 04:40:00'),(15,5,12,'I’m not sure about this, I’d love to hear more opinions on the subject.','2024-11-12 04:45:00'),(16,6,14,'This question is very thought-provoking! Has anyone else thought about this from a different angle?','2024-11-12 04:50:00'),(17,6,2,'I have a different take on this. What do you think about X?','2024-11-12 04:55:00'),(18,7,11,'This is a valid question but there are a lot of factors that need to be explored more deeply.','2024-11-12 05:00:00'),(19,7,4,'I have seen this question being asked multiple times, and I still think the answer needs further clarification.','2024-11-12 05:05:00'),(20,8,13,'This is exactly what I’ve been wondering about! Thanks for asking this question.','2024-11-12 05:10:00'),(21,8,19,'I’m curious about others\' opinions on this. It’s not something I’ve thought about before.','2024-11-12 05:15:00'),(22,9,17,'I don’t agree with the majority opinion here. There’s a better way to look at the situation.','2024-11-12 05:20:00'),(23,9,16,'Can someone elaborate more on this? I feel like I’m missing something important here.','2024-11-12 05:25:00'),(24,10,18,'Great question! It’s definitely a topic I would like to explore further.','2024-11-12 05:30:00'),(25,10,20,'I’m not sure if this is the right way to approach it. Could you explain it further?','2024-11-12 05:35:00');
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `interests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  CONSTRAINT `interests_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Interests`
--

LOCK TABLES `Interests` WRITE;
/*!40000 ALTER TABLE `Interests` DISABLE KEYS */;
INSERT INTO `Interests` VALUES (1,1,1,'2024-11-12 06:30:20'),(2,2,2,'2024-11-12 06:30:20'),(3,3,3,'2024-11-12 06:30:20'),(4,4,4,'2024-11-12 06:30:20'),(5,5,5,'2024-11-12 06:30:20'),(6,1,5,'2024-11-12 04:00:00'),(7,1,7,'2024-11-12 04:05:00'),(8,2,1,'2024-11-12 04:10:00'),(9,2,10,'2024-11-12 04:15:00'),(10,3,3,'2024-11-12 04:20:00'),(11,3,15,'2024-11-12 04:25:00'),(12,4,6,'2024-11-12 04:30:00'),(13,4,9,'2024-11-12 04:35:00'),(14,5,8,'2024-11-12 04:40:00'),(15,5,12,'2024-11-12 04:45:00'),(16,6,14,'2024-11-12 04:50:00'),(17,6,2,'2024-11-12 04:55:00'),(18,7,11,'2024-11-12 05:00:00'),(19,7,4,'2024-11-12 05:05:00'),(20,8,13,'2024-11-12 05:10:00'),(21,8,19,'2024-11-12 05:15:00'),(22,9,17,'2024-11-12 05:20:00'),(23,9,16,'2024-11-12 05:25:00'),(24,10,18,'2024-11-12 05:30:00'),(25,10,20,'2024-11-12 05:35:00');
/*!40000 ALTER TABLE `Interests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Questions`
--

DROP TABLE IF EXISTS `Questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Questions`
--

LOCK TABLES `Questions` WRITE;
/*!40000 ALTER TABLE `Questions` DISABLE KEYS */;
INSERT INTO `Questions` VALUES (1,1,'How do I apply for scholarships at XYZ University?','I am looking for information on the scholarship application process at XYZ University. Any guidance would be appreciated.','2024-11-11 18:30:00'),(2,2,'What are the top online courses for Data Science?','I am looking for recommended online courses to learn Data Science. Any suggestions for beginner-friendly courses?','2024-11-11 19:00:00'),(3,3,'How to integrate an LMS with a university portal?','I am working on integrating an LMS system with the university portal. Can anyone suggest the best approach or technologies to use?','2024-11-11 20:15:00'),(4,4,'What are the prerequisites for enrolling in a machine learning course?','I want to take a machine learning course. What are the prerequisites, and which courses do you recommend?','2024-11-11 21:00:00'),(5,5,'Can I track my scholarship application status on an LMS?','Is it possible to integrate a feature in the LMS to track the status of scholarship applications for students?','2024-11-11 22:45:00'),(6,1,'What are the eligibility criteria for XYZ scholarship?','Can someone provide details on who is eligible for the XYZ scholarship?','2024-11-11 18:00:00'),(7,2,'How do I transfer credits to ABC University?','I want to know the process for transferring credits from another institution to ABC University.','2024-11-11 18:30:00'),(8,3,'What are some recommended certifications for data analytics?','I am interested in data analytics. What certifications are valuable in this field?','2024-11-11 19:15:00'),(9,4,'Can I get a scholarship for studying abroad?','Are there any scholarships available for students who wish to study abroad?','2024-11-11 20:00:00'),(10,5,'What is the application deadline for the fall semester?','Does anyone know the deadline for submitting applications for the upcoming fall semester?','2024-11-11 21:00:00'),(11,6,'What are the prerequisites for the Advanced Machine Learning course?','I am planning to take the Advanced Machine Learning course. What prior knowledge is required?','2024-11-11 21:30:00'),(12,7,'How to get internship opportunities through the university?','I am looking for internships related to my major. What resources does the university provide for finding internships?','2024-11-11 22:00:00'),(13,8,'Can I track my course progress through the LMS?','I want to know if the LMS has a feature for tracking my progress in each course.','2024-11-11 22:30:00'),(14,9,'How do I join clubs and societies on campus?','I am interested in joining some clubs. Can anyone explain how to get involved in campus activities?','2024-11-11 23:00:00'),(15,10,'What housing options are available for first-year students?','Are there specific dorms or residence halls for first-year students? How do I apply for them?','2024-11-11 23:30:00'),(16,3,'How can I access online course materials?','Is there a way to download course materials or access them offline?','2024-11-12 00:00:00'),(17,7,'Are there part-time job opportunities on campus?','I am looking for part-time jobs while studying. Does the campus provide any part-time job opportunities for students?','2024-11-12 00:30:00'),(18,4,'Can I take elective courses outside my major?','I am interested in courses outside my major. Is it allowed to enroll in electives from other departments?','2024-11-12 01:00:00'),(19,1,'What resources are available for academic support?','Are there tutoring services or study groups organized by the university?','2024-11-12 01:30:00'),(20,8,'How do I access the university’s online library?','I need to access academic journals and books. How can I log into the university library system?','2024-11-12 02:00:00');
/*!40000 ALTER TABLE `Questions` ENABLE KEYS */;
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
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
INSERT INTO `Users` VALUES (1,'alice','alice@example.com','$2y$10$EIXhDkYX2r1Kf1v0Rr8WQOBg1YjoZ7','2024-11-12 06:25:45'),(2,'bob','bob@example.com','$2y$10$Nn0/JHg0Pf0S6m4kJkL1zeHfdkM9lQj','2024-11-12 06:25:45'),(3,'charlie','charlie@example.com','$2y$10$fRjK8gYyK8zYB/PZDPHVcsmJeXYk8mz','2024-11-12 06:25:45'),(4,'david','david@example.com','$2y$10$Ra1/LHnm0Pf9S7mKgS7Vj/ZkJ8WR1','2024-11-12 06:25:45'),(5,'eve','eve@example.com','$2y$10$TRH3q5Jg/V6p2eLf4RcV6pXD/q2dfA','2024-11-12 06:25:45'),(6,'testUser','testuser@example.com','$2a$10$.5/11BBG/hSV1UhCf9uue.6ow03trIRV2uGc/wf4DcL4PmyzHu5wG','2024-11-12 07:01:44'),(7,'testUser99','testuser99@example.com','$2a$10$Gcn/E3dYM8X1c2DOo0eBi.PtXv0KqDg.Gzq2FWC2NZ9lbwTBhpice','2024-11-12 07:04:47'),(8,'testUser199','testuser199@example.com','$2a$10$QCogNRnU1qT3oBVMHUNX7eq8.Z/ssPDH.EYDLUv9m5PbiSeAMYNZK','2024-11-12 07:10:50'),(9,'User1','user1@example.com','$2a$10$rtymMSzTG7/5TyfZJyrrwO11/Uek2vPg8F/Z2Ar9y3Td6pPxAP3X2','2024-11-12 07:37:05'),(10,'User2','user2@example.com','$2a$10$83ZHio8BVItzEOMtirI8C..T5Im1.nWiR/i/5yiEYXQSoQ91MDzDG','2024-11-12 07:37:25');
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

-- Dump completed on 2024-11-11 23:50:35
