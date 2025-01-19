-- MySQL dump 10.13  Distrib 9.0.1, for macos14 (arm64)
--
-- Host: localhost    Database: KeelCompass_dev
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

CREATE DATABASE IF NOT EXISTS KeelCompass_dev;
USE KeelCompass_dev;

-- Table structure for table `Users`
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Users_email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Users`
INSERT INTO `Users` VALUES (1, 'john_doe', 'john.doe@example.com', 'hashedpassword1');
INSERT INTO `Users` VALUES (2, 'jane_smith', 'jane.smith@example.com', 'hashedpassword2');
INSERT INTO `Users` VALUES (3, 'michael_brown', 'michael.brown@example.com', 'hashedpassword3');
INSERT INTO `Users` VALUES (4, 'emily_davis', 'emily.davis@example.com', 'hashedpassword4');
INSERT INTO `Users` VALUES (5, 'david_wilson', 'david.wilson@example.com', 'hashedpassword5');

-- Table structure for table `Categories`
CREATE TABLE `Categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Categories_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Categories`
INSERT INTO `Categories` VALUES (1, 'Education');
INSERT INTO `Categories` VALUES (2, 'Jobs');
INSERT INTO `Categories` VALUES (3, 'Technology');
INSERT INTO `Categories` VALUES (4, 'Science');
INSERT INTO `Categories` VALUES (5, 'Health');
INSERT INTO `Categories` VALUES (6, 'Finance');
INSERT INTO `Categories` VALUES (7, 'Lifestyle');
INSERT INTO `Categories` VALUES (8, 'Business');
INSERT INTO `Categories` VALUES (9, 'Government');
INSERT INTO `Categories` VALUES (10, 'Culture');
INSERT INTO `Categories` VALUES (11, 'Environment');
INSERT INTO `Categories` VALUES (12, 'Sports');
INSERT INTO `Categories` VALUES (13, 'Music');
INSERT INTO `Categories` VALUES (14, 'Art');
INSERT INTO `Categories` VALUES (15, 'Travel');
INSERT INTO `Categories` VALUES (16, 'Food');
INSERT INTO `Categories` VALUES (17, 'Books');
INSERT INTO `Categories` VALUES (18, 'News');
INSERT INTO `Categories` VALUES (19, 'Entertainment');
INSERT INTO `Categories` VALUES (20, 'Social Media');
INSERT INTO `Categories` VALUES (21, 'Marketing');
INSERT INTO `Categories` VALUES (22, 'Real Estate');
INSERT INTO `Categories` VALUES (23, 'Education Technology');
INSERT INTO `Categories` VALUES (24, 'Retail');
INSERT INTO `Categories` VALUES (25, 'Gaming');
INSERT INTO `Categories` VALUES (26, 'Non-profit');
INSERT INTO `Categories` VALUES (27, 'Automotive');
INSERT INTO `Categories` VALUES (28, 'Legal');
INSERT INTO `Categories` VALUES (29, 'Fashion');
INSERT INTO `Categories` VALUES (30, 'Agriculture');

-- Table structure for table `Questions`
CREATE TABLE `Questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Questions`
INSERT INTO `Questions` VALUES (1, 1, 'What are the best programming languages for jobs?', 'I am looking to transition into a programming career. What languages should I focus on?');
INSERT INTO `Questions` VALUES (2, 2, 'How to improve resume for education roles?', 'What are the key points that make a resume stand out for roles in education?');
INSERT INTO `Questions` VALUES (3, 3, 'Is a degree necessary for software jobs?', 'Can I land a good software development job without a formal degree?');
INSERT INTO `Questions` VALUES (4, 4, 'What are the best platforms for job preparation?', 'I want to prepare for job interviews. Are there any specific platforms you recommend?');
INSERT INTO `Questions` VALUES (5, 5, 'How to excel in teaching roles?', 'I am about to start my career as a teacher. Any tips to excel in this profession?');
INSERT INTO `Questions` VALUES (6, 1, 'How to find remote work opportunities?', 'I am looking for remote job opportunities in software engineering. Any suggestions?');
INSERT INTO `Questions` VALUES (7, 2, 'What are key skills for data science?', 'I want to become a data scientist. What skills should I develop?');
INSERT INTO `Questions` VALUES (8, 3, 'What certifications help in IT jobs?', 'Which certifications would improve my chances of getting hired in IT?');
INSERT INTO `Questions` VALUES (9, 4, 'How to ace coding interviews?', 'What are some tips to excel in coding interviews at top companies?');
INSERT INTO `Questions` VALUES (10, 5, 'How to stay organized as a teacher?', 'Any tools or strategies to stay organized while teaching?');
INSERT INTO `Questions` VALUES (11, 1, 'What are some good work-life balance tips?', 'How do you maintain work-life balance while working from home?');
INSERT INTO `Questions` VALUES (12, 2, 'How can I grow my career in education?', 'What are some steps I can take to advance my career in education?');
INSERT INTO `Questions` VALUES (13, 3, 'How to break into AI jobs?', 'What is the best way to break into the AI field from a software engineering background?');
INSERT INTO `Questions` VALUES (14, 4, 'How to handle multiple job offers?', 'I have multiple job offers. How should I choose the right one?');
INSERT INTO `Questions` VALUES (15, 5, 'How to deal with student behavioral issues?', 'What is the best way to handle behavioral issues in the classroom?');
-- Continue similar entries for other questions (totaling to 30)

-- Table structure for table `Comments`
CREATE TABLE `Comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `question_id` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Comments`
INSERT INTO `Comments` VALUES (1, 1, 1, 'Python is great for programming jobs, but don’t forget Java for enterprise roles.');
INSERT INTO `Comments` VALUES (2, 2, 2, 'Highlighting mentoring experience can help strengthen your resume.');
INSERT INTO `Comments` VALUES (3, 3, 3, 'Some software jobs value experience over a degree.');
INSERT INTO `Comments` VALUES (4, 4, 4, 'Use platforms like LeetCode and CodeSignal for job interview prep.');
INSERT INTO `Comments` VALUES (5, 5, 5, 'Stay updated with new educational trends through webinars and networking.');
-- Continue similar entries for other comments (totaling to 30)

-- Table structure for table `Interests`
CREATE TABLE `Interests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `interest` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `interests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `Interests`
INSERT INTO `Interests` VALUES (1, 1, 'Machine Learning');
INSERT INTO `Interests` VALUES (2, 2, 'Classroom Management');
INSERT INTO `Interests` VALUES (3, 3, 'Cloud Computing');
INSERT INTO `Interests` VALUES (4, 4, 'Career Coaching');
INSERT INTO `Interests` VALUES (5, 5, 'Teaching English');
-- Continue similar entries for other interests (totaling to 30)

-- Table structure for table `QuestionCategory`
CREATE TABLE `QuestionCategory` (
  `question_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`question_id`, `category_id`),
  CONSTRAINT `questioncategory_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`),
  CONSTRAINT `questioncategory_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table `QuestionCategory`
INSERT INTO `QuestionCategory` VALUES (1, 3);
INSERT INTO `QuestionCategory` VALUES (2, 1);
INSERT INTO `QuestionCategory` VALUES (3, 3);
INSERT INTO `QuestionCategory` VALUES (4, 2);
INSERT INTO `QuestionCategory` VALUES (5, 1);
-- Continue similar entries for other categories and questions (totaling to 30)
