-- MySQL dump 10.13  Distrib 9.0.1, for macos14 (arm64)
--
-- Host: localhost    Database: keelworksdata
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
-- Table structure for table `Answers`
--

DROP TABLE IF EXISTS `Answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Answers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `Questions` (`id`),
  CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Answers`
--

LOCK TABLES `Answers` WRITE;
/*!40000 ALTER TABLE `Answers` DISABLE KEYS */;
INSERT INTO `Answers` VALUES (1,1,2,'You can start by researching common interview questions and practicing your responses. It’s also helpful to do mock interviews.','2024-09-12 23:34:08'),(2,2,3,'Effective data cleaning involves removing duplicates, handling missing values, and standardizing formats. Tools like Python’s Pandas can be very useful.','2024-09-12 23:34:08'),(3,3,4,'To implement OAuth, you need to register your app with the OAuth provider, get the client ID and secret, and then use these to get an access token.','2024-09-12 23:34:08'),(4,4,5,'Key UI features include intuitive navigation, responsive design, and accessibility. Consistent styling and clear calls-to-action are also crucial.','2024-09-12 23:34:08'),(5,5,6,'Optimizing SQL queries involves indexing, avoiding unnecessary columns, and using efficient joins. Analyze your queries with an execution plan for improvements.','2024-09-12 23:34:08'),(6,6,7,'The future of AI includes advancements in deep learning, AI ethics, and more widespread adoption in various industries. Keep an eye on emerging technologies.','2024-09-12 23:34:08'),(7,7,8,'Docker can streamline development by allowing you to create reproducible environments. Start by creating Dockerfiles and using Docker Compose for multi-container setups.','2024-09-12 23:34:08'),(8,8,9,'Handling large datasets involves partitioning data, using distributed systems, and optimizing queries. Tools like Apache Spark can help manage big data efficiently.','2024-09-12 23:34:08'),(9,9,10,'The benefits of cloud computing include scalability, cost-efficiency, and access to advanced services like AI and machine learning. It also offers better data security and disaster recovery.','2024-09-12 23:34:08'),(10,10,11,'Begin with online courses or tutorials in machine learning. Start with simple algorithms like linear regression before moving on to more complex models.','2024-09-12 23:34:08'),(11,11,12,'Some of the best tools include Visual Studio Code for code editing, GitHub for version control, and Postman for API testing. Explore tools based on your specific needs.','2024-09-12 23:34:08'),(12,12,13,'To improve website load time, optimize images, minimize HTTP requests, and leverage browser caching. Consider using a content delivery network (CDN) as well.','2024-09-12 23:34:08'),(13,13,14,'Security best practices include using HTTPS, validating user input, and implementing proper authentication and authorization mechanisms.','2024-09-12 23:34:08'),(14,14,15,'Choosing the right programming language depends on your project needs and personal preference. Consider factors like performance, community support, and library availability.','2024-09-12 23:34:08'),(15,15,16,'Recent trends in mobile development include the rise of cross-platform frameworks like Flutter, advancements in mobile AI, and improved app security practices.','2024-09-12 23:34:08'),(16,16,17,'Building a REST API involves defining endpoints, setting up routing, and handling HTTP methods. Use frameworks like Express for Node.js or Flask for Python to simplify the process.','2024-09-12 23:34:08'),(17,17,18,'Effective SEO strategies include keyword research, on-page optimization, and building high-quality backlinks. Regularly updating content and improving site speed also helps.','2024-09-12 23:34:08'),(18,18,19,'Managing project deadlines involves setting clear goals, breaking tasks into manageable chunks, and using project management tools. Regular check-ins with your team can help stay on track.','2024-09-12 23:34:08'),(19,19,20,'DevOps integrates development and operations to enhance efficiency. Key principles include continuous integration, automated testing, and monitoring.','2024-09-12 23:34:08'),(20,20,21,'Implementing a microservices architecture involves breaking down applications into small, independent services. Each service should be loosely coupled and communicate via APIs.','2024-09-12 23:34:08'),(21,21,22,'Challenges of remote work include communication issues and maintaining team cohesion. Using collaboration tools and setting clear expectations can help mitigate these challenges.','2024-09-12 23:34:08'),(22,22,23,'To get started with data visualization, use tools like Tableau or Power BI. Focus on presenting data clearly and choosing the right type of visualization for your data.','2024-09-12 23:34:08'),(23,23,24,'Common pitfalls in software testing include inadequate test coverage and ignoring edge cases. Ensure comprehensive testing and regular updates to your test cases.','2024-09-12 23:34:08'),(24,24,25,'Effective version control involves using branching strategies, committing frequently, and collaborating through pull requests. Tools like Git can help manage your codebase efficiently.','2024-09-12 23:34:08'),(25,25,26,'Continuous integration offers benefits such as early bug detection and faster release cycles. Implement automated testing and integration to streamline development.','2024-09-12 23:34:08'),(26,26,27,'Authentication and authorization can be implemented using frameworks like OAuth for authorization and JWT for token-based authentication. Ensure secure handling of user credentials.','2024-09-12 23:34:08'),(27,27,28,'Agile methodology principles include iterative development, regular feedback, and adapting to change. Emphasize collaboration and delivering small increments of value.','2024-09-12 23:34:08'),(28,28,29,'Integrating third-party APIs involves understanding the API documentation, handling authentication, and managing responses and errors. Use libraries or SDKs provided by the API.','2024-09-12 23:34:08'),(29,29,30,'Recent advancements in blockchain include improvements in scalability, new consensus algorithms, and applications beyond cryptocurrencies. Explore developments in smart contracts and decentralized finance.','2024-09-12 23:34:08'),(30,30,1,'Problem-solving in programming involves understanding the problem, breaking it into smaller parts, and using debugging tools. Practice regularly to improve your problem-solving skills.','2024-09-12 23:34:08');
/*!40000 ALTER TABLE `Answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Articles`
--

DROP TABLE IF EXISTS `Articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Articles`
--

LOCK TABLES `Articles` WRITE;
/*!40000 ALTER TABLE `Articles` DISABLE KEYS */;
INSERT INTO `Articles` VALUES (1,'The Future of AI','Exploring the potential advancements and applications of artificial intelligence.',1,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(2,'Top 10 Programming Languages','A comprehensive list of the top programming languages to learn in 2024.',2,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(3,'How to Optimize SQL Queries','Techniques and strategies for optimizing SQL queries to improve performance.',3,'Draft','2024-09-12 23:41:54','2024-09-12 23:41:54'),(4,'Getting Started with Docker','A beginner’s guide to using Docker for containerization and development.',4,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(5,'Understanding Cloud Computing','An overview of cloud computing concepts and benefits for modern businesses.',5,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(6,'Best Practices for Data Security','Key practices to ensure data security and protect against breaches.',6,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(7,'Introduction to Machine Learning','Basic concepts and techniques in machine learning for beginners.',7,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(8,'Developing Mobile Apps with Flutter','A guide to creating mobile applications using the Flutter framework.',8,'Draft','2024-09-12 23:41:54','2024-09-12 23:41:54'),(9,'The Impact of Blockchain Technology','How blockchain is changing industries and its potential future applications.',9,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(10,'Effective UI/UX Design Principles','Essential principles for designing intuitive and user-friendly interfaces.',10,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(11,'Advanced Techniques in Data Analytics','Exploring advanced methods and tools in data analytics.',11,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(12,'How to Start a Tech Blog','Tips and strategies for launching and growing a successful tech blog.',12,'Draft','2024-09-12 23:41:54','2024-09-12 23:41:54'),(13,'The Role of AI in Healthcare','How artificial intelligence is transforming the healthcare industry.',13,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(14,'Building Scalable Web Applications','Techniques for designing and building scalable web applications.',14,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(15,'Exploring Quantum Computing','An introduction to quantum computing and its potential impact on technology.',15,'Draft','2024-09-12 23:41:54','2024-09-12 23:41:54'),(16,'Data Visualization Best Practices','Tips for creating effective and informative data visualizations.',16,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(17,'Understanding Microservices Architecture','A guide to implementing and managing microservices architecture in software development.',17,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(18,'The Evolution of E-Commerce Platforms','How e-commerce platforms have evolved and what to expect in the future.',18,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(19,'Introduction to Serverless Computing','An overview of serverless computing and its advantages for developers.',19,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(20,'Effective Strategies for SEO','Techniques and best practices for optimizing websites for search engines.',20,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(21,'How to Implement CI/CD Pipelines','A guide to setting up continuous integration and continuous delivery pipelines.',21,'Draft','2024-09-12 23:41:54','2024-09-12 23:41:54'),(22,'The Benefits of Agile Methodology','Exploring the benefits and practices of Agile methodology in software development.',22,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(23,'Creating Interactive Dashboards with Power BI','How to build interactive and insightful dashboards using Power BI.',23,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(24,'Understanding RESTful APIs','Basics of RESTful APIs and how to design and use them effectively.',24,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(25,'Challenges in Big Data Analytics','Common challenges faced in big data analytics and strategies to overcome them.',25,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(26,'The Rise of Remote Work Technology','How technology is facilitating the rise of remote work and virtual teams.',26,'Draft','2024-09-12 23:41:54','2024-09-12 23:41:54'),(27,'Future Trends in Cybersecurity','Emerging trends and technologies in the field of cybersecurity.',27,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(28,'Developing Effective Mobile User Interfaces','Principles and techniques for designing effective mobile user interfaces.',28,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54'),(29,'Overview of Ethical Hacking','Introduction to ethical hacking and its role in cybersecurity.',29,'Draft','2024-09-12 23:41:54','2024-09-12 23:41:54'),(30,'How to Build Scalable APIs','Strategies for designing and building APIs that can scale effectively.',30,'Published','2024-09-12 23:41:54','2024-09-12 23:41:54');
/*!40000 ALTER TABLE `Articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ArticleTags`
--

DROP TABLE IF EXISTS `ArticleTags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ArticleTags` (
  `article_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`article_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `articletags_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `Articles` (`id`),
  CONSTRAINT `articletags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `Tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ArticleTags`
--

LOCK TABLES `ArticleTags` WRITE;
/*!40000 ALTER TABLE `ArticleTags` DISABLE KEYS */;
INSERT INTO `ArticleTags` VALUES (2,2),(15,2),(20,2),(25,2),(24,3),(3,4),(11,4),(16,4),(21,4),(27,4),(1,5),(7,5),(13,5),(23,5),(29,5),(2,6),(4,6),(8,6),(16,6),(18,6),(25,6),(30,6),(14,7),(18,7),(22,7),(1,8),(5,8),(9,8),(21,8),(26,8),(29,8),(6,9),(20,9),(30,9),(4,10),(11,10),(19,10),(1,11),(3,11),(7,11),(17,11),(22,11),(28,11),(5,12),(9,12),(23,12),(28,12),(5,13),(13,13),(27,13),(14,14),(26,14),(6,15),(10,15),(19,15),(1,16),(8,16),(15,16),(23,16),(7,17),(24,17),(2,18),(17,18),(12,19),(8,20),(15,20),(27,20),(3,21),(12,21),(20,21),(30,21),(4,22),(21,22),(26,22),(10,23),(17,23),(12,24),(10,25),(14,25),(9,26),(25,26),(29,26),(6,27),(18,27),(22,27),(19,28),(13,29),(11,30),(16,30),(24,30),(28,30);
/*!40000 ALTER TABLE `ArticleTags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `article_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `article_id` (`article_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `Articles` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (1,1,2,'Great article!','2024-09-12 23:49:25'),(2,1,3,'Very informative, thanks!','2024-09-12 23:49:25'),(3,1,4,'I learned a lot from this.','2024-09-12 23:49:25'),(4,2,1,'Excellent overview, well done.','2024-09-12 23:49:25'),(5,2,5,'This helped me understand the topic better.','2024-09-12 23:49:25'),(6,3,6,'Interesting perspective on this subject.','2024-09-12 23:49:25'),(7,3,2,'Thanks for the insights!','2024-09-12 23:49:25'),(8,4,7,'This article is a great resource.','2024-09-12 23:49:25'),(9,4,8,'I appreciate the detailed explanation.','2024-09-12 23:49:25'),(10,5,9,'Useful information, thank you.','2024-09-12 23:49:25'),(11,5,10,'I found this very helpful.','2024-09-12 23:49:25'),(12,6,11,'Good content, keep it up!','2024-09-12 23:49:25'),(13,6,12,'This was exactly what I needed.','2024-09-12 23:49:25'),(14,7,13,'Very well-written article.','2024-09-12 23:49:25'),(15,7,14,'I agree with the points made.','2024-09-12 23:49:25'),(16,8,15,'Great insights, thanks for sharing.','2024-09-12 23:49:25'),(17,8,16,'I enjoyed reading this.','2024-09-12 23:49:25'),(18,9,17,'This article is very relevant.','2024-09-12 23:49:25'),(19,9,18,'Informative and well-structured.','2024-09-12 23:49:25'),(20,10,19,'Excellent read, thank you!','2024-09-12 23:49:25'),(21,10,20,'Well-explained and useful.','2024-09-12 23:49:25'),(22,11,21,'Great job on this article.','2024-09-12 23:49:25'),(23,11,22,'I found this very enlightening.','2024-09-12 23:49:25'),(24,12,23,'Good job, very helpful.','2024-09-12 23:49:25'),(25,12,24,'I appreciate the thorough coverage.','2024-09-12 23:49:25'),(26,13,25,'This article is quite engaging.','2024-09-12 23:49:25'),(27,13,26,'Nice work, very informative.','2024-09-12 23:49:25'),(28,14,27,'Well-written and insightful.','2024-09-12 23:49:25'),(29,14,28,'This article provided a lot of value.','2024-09-12 23:49:25'),(30,15,29,'Thanks for the great article.','2024-09-12 23:49:25'),(31,15,30,'I found this very useful, thanks.','2024-09-12 23:49:25'),(32,16,1,'Interesting read, well done.','2024-09-12 23:49:25'),(33,16,3,'This article was very helpful.','2024-09-12 23:49:25'),(34,17,4,'Good article, thanks for sharing.','2024-09-12 23:49:25'),(35,17,5,'I liked the points discussed here.','2024-09-12 23:49:25'),(36,18,6,'Very informative, great work.','2024-09-12 23:49:25'),(37,18,7,'I learned a lot from this.','2024-09-12 23:49:25'),(38,19,8,'Great content, appreciate it.','2024-09-12 23:49:25'),(39,19,9,'This article was very insightful.','2024-09-12 23:49:25'),(40,20,10,'Thank you for this article, very useful.','2024-09-12 23:49:25'),(41,20,11,'I enjoyed the read, thanks!','2024-09-12 23:49:25');
/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Communities`
--

DROP TABLE IF EXISTS `Communities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Communities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Communities`
--

LOCK TABLES `Communities` WRITE;
/*!40000 ALTER TABLE `Communities` DISABLE KEYS */;
INSERT INTO `Communities` VALUES (1,'Tech Enthusiasts','A community for tech lovers.','2024-09-12 23:25:12'),(2,'Data Science Gurus','A space for data scientists to share knowledge.','2024-09-12 23:25:12'),(3,'AI Innovators','Community focused on artificial intelligence breakthroughs.','2024-09-12 23:25:12'),(4,'Full Stack Developers','For developers mastering front and back end technologies.','2024-09-12 23:25:12'),(5,'Cloud Computing Experts','Discussion hub for cloud infrastructure and services.','2024-09-12 23:25:12'),(6,'DevOps Engineers','A community for DevOps practices and automation.','2024-09-12 23:25:12'),(7,'Cybersecurity Pros','Where cybersecurity professionals share insights.','2024-09-12 23:25:12'),(8,'Blockchain Pioneers','Exploring blockchain and decentralized technologies.','2024-09-12 23:25:12'),(9,'Mobile App Developers','Community for Android and iOS app development.','2024-09-12 23:25:12'),(10,'Game Developers','For enthusiasts in game design and development.','2024-09-12 23:25:12'),(11,'Web Designers','A place for creatives working on web design and UI/UX.','2024-09-12 23:25:12'),(12,'Digital Marketers','Community focused on digital marketing strategies.','2024-09-12 23:25:12'),(13,'Machine Learning Experts','A space for ML practitioners to collaborate.','2024-09-12 23:25:12'),(14,'IoT Enthusiasts','Exploring the world of Internet of Things devices.','2024-09-12 23:25:12'),(15,'AR/VR Innovators','For those interested in augmented and virtual reality.','2024-09-12 23:25:12'),(16,'Start-Up Founders','A community for entrepreneurs and start-up discussions.','2024-09-12 23:25:12'),(17,'Product Managers','For product managers to discuss strategies and tools.','2024-09-12 23:25:12'),(18,'Python Programmers','Dedicated to Python development and best practices.','2024-09-12 23:25:12'),(19,'Java Developers','A community for all things Java and JVM languages.','2024-09-12 23:25:12'),(20,'AI Ethics Community','Discussing ethical implications of AI technologies.','2024-09-12 23:25:12'),(21,'Frontend Developers','For those specializing in HTML, CSS, and JavaScript.','2024-09-12 23:25:12'),(22,'Backend Developers','A community focused on server-side technologies.','2024-09-12 23:25:12'),(23,'Cloud Architects','Sharing best practices for cloud system architecture.','2024-09-12 23:25:12'),(24,'Robotics Engineers','For those working in robotics and automation.','2024-09-12 23:25:12'),(25,'Software Testing Pros','A community for QA and software testing professionals.','2024-09-12 23:25:12'),(26,'Data Analysts','Discussing data analysis techniques and tools.','2024-09-12 23:25:12'),(27,'Business Analysts','For BAs working in various industries and domains.','2024-09-12 23:25:12'),(28,'SQL Experts','A community for database developers and SQL query writers.','2024-09-12 23:25:12'),(29,'Open Source Contributors','For contributors to open-source projects and libraries.','2024-09-12 23:25:12'),(30,'Freelancers','A space for freelance developers and designers to network.','2024-09-12 23:25:12');
/*!40000 ALTER TABLE `Communities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GroupMembers`
--

DROP TABLE IF EXISTS `GroupMembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GroupMembers` (
  `group_id` int NOT NULL,
  `user_id` int NOT NULL,
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `groupmembers_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `Groups` (`id`),
  CONSTRAINT `groupmembers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GroupMembers`
--

LOCK TABLES `GroupMembers` WRITE;
/*!40000 ALTER TABLE `GroupMembers` DISABLE KEYS */;
INSERT INTO `GroupMembers` VALUES (1,1,'2024-09-12 23:39:02'),(1,2,'2024-09-12 23:39:02'),(1,3,'2024-09-12 23:39:02'),(1,4,'2024-09-12 23:39:02'),(1,5,'2024-09-12 23:39:02'),(2,1,'2024-09-12 23:39:02'),(2,2,'2024-09-12 23:39:02'),(2,6,'2024-09-12 23:39:02'),(2,7,'2024-09-12 23:39:02'),(2,8,'2024-09-12 23:39:02'),(3,2,'2024-09-12 23:39:02'),(3,3,'2024-09-12 23:39:02'),(3,4,'2024-09-12 23:39:02'),(3,5,'2024-09-12 23:39:02'),(3,6,'2024-09-12 23:39:02'),(4,4,'2024-09-12 23:39:02'),(4,7,'2024-09-12 23:39:02'),(4,8,'2024-09-12 23:39:02'),(4,9,'2024-09-12 23:39:02'),(4,10,'2024-09-12 23:39:02'),(5,6,'2024-09-12 23:39:02'),(5,7,'2024-09-12 23:39:02'),(5,8,'2024-09-12 23:39:02'),(5,9,'2024-09-12 23:39:02'),(5,10,'2024-09-12 23:39:02'),(6,1,'2024-09-12 23:39:02'),(6,3,'2024-09-12 23:39:02'),(6,5,'2024-09-12 23:39:02'),(6,8,'2024-09-12 23:39:02'),(6,10,'2024-09-12 23:39:02'),(7,2,'2024-09-12 23:39:02'),(7,4,'2024-09-12 23:39:02'),(7,6,'2024-09-12 23:39:02'),(7,9,'2024-09-12 23:39:02'),(7,10,'2024-09-12 23:39:02'),(8,1,'2024-09-12 23:39:02'),(8,3,'2024-09-12 23:39:02'),(8,7,'2024-09-12 23:39:02'),(8,9,'2024-09-12 23:39:02'),(8,10,'2024-09-12 23:39:02');
/*!40000 ALTER TABLE `GroupMembers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Groups`
--

DROP TABLE IF EXISTS `Groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `community_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `community_id` (`community_id`),
  CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `Communities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Groups`
--

LOCK TABLES `Groups` WRITE;
/*!40000 ALTER TABLE `Groups` DISABLE KEYS */;
INSERT INTO `Groups` VALUES (1,1,'Tech Innovations','A group for discussing the latest trends in technology and innovation.','2024-09-12 23:37:07'),(2,1,'AI Enthusiasts','A group dedicated to discussions on artificial intelligence and machine learning.','2024-09-12 23:37:07'),(3,2,'Career Development','A group focused on career growth, job search strategies, and professional development.','2024-09-12 23:37:07'),(4,2,'Education Insights','A group for sharing educational resources, learning strategies, and academic discussions.','2024-09-12 23:37:07'),(5,3,'Data Science Network','A group for professionals and enthusiasts in data science and analytics.','2024-09-12 23:37:07'),(6,3,'Big Data Trends','A group dedicated to trends, tools, and techniques in big data.','2024-09-12 23:37:07'),(7,4,'Software Engineering','A group for software engineers to share knowledge, best practices, and industry news.','2024-09-12 23:37:07'),(8,4,'DevOps Practices','A group focused on DevOps methodologies, tools, and practices.','2024-09-12 23:37:07'),(9,5,'Blockchain Developers','A group for developers interested in blockchain technology and its applications.','2024-09-12 23:37:07'),(10,5,'Cryptocurrency Talk','A group for discussions on cryptocurrency trends, trading, and investment.','2024-09-12 23:37:07'),(11,6,'Startup Founders','A group for startup founders to share experiences, challenges, and success stories.','2024-09-12 23:37:07'),(12,6,'Entrepreneurial Insights','A group dedicated to entrepreneurial advice, business strategies, and networking.','2024-09-12 23:37:07'),(13,7,'Web Development','A group for web developers to discuss the latest in web technologies and frameworks.','2024-09-12 23:37:07'),(14,7,'UI/UX Design','A group focused on user interface and user experience design.','2024-09-12 23:37:07'),(15,8,'Cloud Computing','A group for discussions on cloud services, solutions, and best practices.','2024-09-12 23:37:07'),(16,8,'Serverless Architecture','A group dedicated to serverless computing and its benefits.','2024-09-12 23:37:07'),(17,9,'Cybersecurity Experts','A group for cybersecurity professionals to share knowledge and strategies.','2024-09-12 23:37:07'),(18,9,'Ethical Hacking','A group focused on ethical hacking techniques and cybersecurity practices.','2024-09-12 23:37:07'),(19,10,'Machine Learning Projects','A group for sharing and discussing machine learning projects and research.','2024-09-12 23:37:07'),(20,10,'Deep Learning Applications','A group dedicated to applications of deep learning and neural networks.','2024-09-12 23:37:07'),(21,11,'Digital Marketing','A group for digital marketers to discuss strategies, tools, and trends.','2024-09-12 23:37:07'),(22,11,'Content Creation','A group focused on content creation, marketing, and distribution strategies.','2024-09-12 23:37:07'),(23,12,'Gaming Development','A group for game developers to share insights and discuss game design and development.','2024-09-12 23:37:07'),(24,12,'Virtual Reality','A group dedicated to virtual reality technologies and applications.','2024-09-12 23:37:07'),(25,13,'Mobile App Development','A group for developers working on mobile applications and related technologies.','2024-09-12 23:37:07'),(26,13,'Cross-Platform Tools','A group focused on tools and frameworks for cross-platform mobile development.','2024-09-12 23:37:07'),(27,14,'AI in Healthcare','A group for discussing the impact and applications of AI in the healthcare sector.','2024-09-12 23:37:07'),(28,14,'Healthcare Innovations','A group dedicated to innovations and technologies in healthcare.','2024-09-12 23:37:07'),(29,15,'Educational Technology','A group for exploring technology trends and tools in education.','2024-09-12 23:37:07'),(30,15,'E-Learning Solutions','A group focused on e-learning platforms and solutions.','2024-09-12 23:37:07'),(31,16,'Data Engineering','A group for professionals involved in data engineering and pipeline design.','2024-09-12 23:37:07'),(32,16,'ETL Processes','A group dedicated to discussing ETL processes and best practices.','2024-09-12 23:37:07');
/*!40000 ALTER TABLE `Groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notifications`
--

LOCK TABLES `Notifications` WRITE;
/*!40000 ALTER TABLE `Notifications` DISABLE KEYS */;
INSERT INTO `Notifications` VALUES (1,1,'New article published!',0,'2024-09-12 23:21:40'),(2,2,'Your profile has been updated.',1,'2024-09-12 23:21:40'),(3,3,'You have a new message from the admin.',0,'2024-09-12 23:21:40'),(4,4,'System maintenance is scheduled for tonight.',1,'2024-09-12 23:21:40'),(5,5,'Welcome to the platform!',1,'2024-09-12 23:21:40'),(6,6,'Your course content has been updated.',0,'2024-09-12 23:21:40'),(7,7,'New message from your facilitator.',0,'2024-09-12 23:21:40'),(8,8,'Please verify your email address.',0,'2024-09-12 23:21:40'),(9,9,'Your report is ready for review.',1,'2024-09-12 23:21:40'),(10,10,'You have a new assignment due tomorrow.',0,'2024-09-12 23:21:40'),(11,11,'Your password was successfully changed.',1,'2024-09-12 23:21:40'),(12,12,'Reminder: Upcoming event on Friday.',0,'2024-09-12 23:21:40'),(13,13,'Your account has been flagged for suspicious activity.',1,'2024-09-12 23:21:40'),(14,14,'A new comment has been added to your post.',0,'2024-09-12 23:21:40'),(15,15,'New learning resource is available.',1,'2024-09-12 23:21:40'),(16,16,'Your certification is expiring soon.',0,'2024-09-12 23:21:40'),(17,17,'New question from a student in your course.',0,'2024-09-12 23:21:40'),(18,18,'Feedback received on your recent project.',1,'2024-09-12 23:21:40'),(19,19,'You have been invited to a group study session.',0,'2024-09-12 23:21:40'),(20,20,'Your course has been completed successfully.',1,'2024-09-12 23:21:40'),(21,21,'A new badge has been awarded to you.',0,'2024-09-12 23:21:40'),(22,22,'Reminder: Submission deadline is approaching.',0,'2024-09-12 23:21:40'),(23,23,'New discussion started in your group.',1,'2024-09-12 23:21:40'),(24,24,'System update completed successfully.',1,'2024-09-12 23:21:40'),(25,25,'Your scheduled exam is tomorrow.',0,'2024-09-12 23:21:40'),(26,26,'You have unread messages in your inbox.',0,'2024-09-12 23:21:40'),(27,27,'Your subscription is about to expire.',1,'2024-09-12 23:21:40'),(28,28,'New peer review assigned.',0,'2024-09-12 23:21:40'),(29,29,'Reminder: Update your profile information.',1,'2024-09-12 23:21:40'),(30,30,'Your recent activity has been recorded.',0,'2024-09-12 23:21:40');
/*!40000 ALTER TABLE `Notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Questions`
--

DROP TABLE IF EXISTS `Questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `user_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Questions`
--

LOCK TABLES `Questions` WRITE;
/*!40000 ALTER TABLE `Questions` DISABLE KEYS */;
INSERT INTO `Questions` VALUES (1,'How to prepare for interviews?','Looking for tips and strategies.',1,'Open','2024-09-12 23:29:41'),(2,'Best practices for data cleaning?','What are the most effective techniques?',2,'Open','2024-09-12 23:29:41'),(3,'How to implement OAuth in a web app?','Detailed guidance on OAuth integration.',3,'Closed','2024-09-12 23:29:41'),(4,'What are the key features of a good UI?','Discussing essential UI components.',4,'Open','2024-09-12 23:29:41'),(5,'How to optimize SQL queries?','Seeking advice on improving query performance.',5,'Open','2024-09-12 23:29:41'),(6,'What is the future of AI?','Exploring trends and predictions.',6,'Closed','2024-09-12 23:29:41'),(7,'How to use Docker for development?','Best practices for containerization.',7,'Open','2024-09-12 23:29:41'),(8,'How to handle large datasets?','Techniques for managing big data.',8,'Open','2024-09-12 23:29:41'),(9,'What are the benefits of cloud computing?','Discussing the advantages of cloud solutions.',9,'Closed','2024-09-12 23:29:41'),(10,'How to start with machine learning?','Guidance for beginners in ML.',10,'Open','2024-09-12 23:29:41'),(11,'What are the best tools for web development?','Seeking recommendations for development tools.',11,'Open','2024-09-12 23:29:41'),(12,'How to improve website load time?','Strategies to enhance page speed.',12,'Closed','2024-09-12 23:29:41'),(13,'What are the security best practices for web applications?','Tips for securing web apps.',13,'Open','2024-09-12 23:29:41'),(14,'How to choose the right programming language?','Criteria for selecting a programming language.',14,'Open','2024-09-12 23:29:41'),(15,'What are the latest trends in mobile development?','Discussion on recent advancements.',15,'Closed','2024-09-12 23:29:41'),(16,'How to build a REST API?','Step-by-step guide on creating a RESTful API.',16,'Open','2024-09-12 23:29:41'),(17,'What are some effective SEO strategies?','Techniques for improving search engine ranking.',17,'Open','2024-09-12 23:29:41'),(18,'How to manage project deadlines?','Advice on meeting project milestones.',18,'Closed','2024-09-12 23:29:41'),(19,'What is the role of DevOps in software development?','Exploring DevOps principles and practices.',19,'Open','2024-09-12 23:29:41'),(20,'How to implement a microservices architecture?','Guidance on designing microservices.',20,'Open','2024-09-12 23:29:41'),(21,'What are the challenges of remote work?','Discussing common issues and solutions.',21,'Closed','2024-09-12 23:29:41'),(22,'How to get started with data visualization?','Tips for creating effective visualizations.',22,'Open','2024-09-12 23:29:41'),(23,'What are some common pitfalls in software testing?','Advice on avoiding common testing mistakes.',23,'Open','2024-09-12 23:29:41'),(24,'How to use version control systems effectively?','Best practices for using Git and other tools.',24,'Closed','2024-09-12 23:29:41'),(25,'What are the benefits of continuous integration?','Discussing the advantages of CI in development.',25,'Open','2024-09-12 23:29:41'),(26,'How to implement authentication and authorization?','Best practices for secure user management.',26,'Open','2024-09-12 23:29:41'),(27,'What are the key principles of agile methodology?','Exploring agile development practices.',27,'Closed','2024-09-12 23:29:41'),(28,'How to integrate third-party APIs?','Guidelines for connecting with external services.',28,'Open','2024-09-12 23:29:41'),(29,'What are the latest advancements in blockchain?','Discussion on current blockchain innovations.',29,'Open','2024-09-12 23:29:41'),(30,'How to approach problem-solving in programming?','Techniques for effective debugging and solution.',30,'Closed','2024-09-12 23:29:41');
/*!40000 ALTER TABLE `Questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tags`
--

DROP TABLE IF EXISTS `Tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tags`
--

LOCK TABLES `Tags` WRITE;
/*!40000 ALTER TABLE `Tags` DISABLE KEYS */;
INSERT INTO `Tags` VALUES (1,'Education'),(2,'Career'),(3,'Technology'),(4,'Data Science'),(5,'Artificial Intelligence'),(6,'Web Development'),(7,'Mobile Development'),(8,'Cloud Computing'),(9,'Cybersecurity'),(10,'DevOps'),(11,'Machine Learning'),(12,'Blockchain'),(13,'Internet of Things'),(14,'Digital Marketing'),(15,'Software Engineering'),(16,'Full Stack'),(17,'Frontend'),(18,'Backend'),(19,'Programming'),(20,'JavaScript'),(21,'Python'),(22,'Java'),(23,'React'),(24,'Node.js'),(25,'SQL'),(26,'Big Data'),(27,'Networking'),(28,'Robotics'),(29,'Entrepreneurship'),(30,'UI/UX'),(31,'Virtual Reality');
/*!40000 ALTER TABLE `Tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserActivityLog`
--

DROP TABLE IF EXISTS `UserActivityLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserActivityLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `article_id` int DEFAULT NULL,
  `comment_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `article_id` (`article_id`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `useractivitylog_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  CONSTRAINT `useractivitylog_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `Articles` (`id`),
  CONSTRAINT `useractivitylog_ibfk_3` FOREIGN KEY (`comment_id`) REFERENCES `Comments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserActivityLog`
--

LOCK TABLES `UserActivityLog` WRITE;
/*!40000 ALTER TABLE `UserActivityLog` DISABLE KEYS */;
INSERT INTO `UserActivityLog` VALUES (1,1,'Viewed article','2024-09-01 10:15:00',1,NULL),(2,2,'Commented on article','2024-09-01 11:00:00',1,1),(3,3,'Liked article','2024-09-01 12:30:00',2,NULL),(4,4,'Shared article','2024-09-01 13:45:00',3,NULL),(5,5,'Commented on article','2024-09-01 14:00:00',2,2),(6,6,'Viewed article','2024-09-01 15:00:00',4,NULL),(7,7,'Liked article','2024-09-01 16:30:00',5,NULL),(8,8,'Shared article','2024-09-01 17:00:00',6,NULL),(9,9,'Commented on article','2024-09-01 18:15:00',3,3),(10,10,'Viewed article','2024-09-01 19:00:00',7,NULL),(11,11,'Liked article','2024-09-01 20:30:00',8,NULL),(12,12,'Commented on article','2024-09-01 21:00:00',4,4),(13,13,'Viewed article','2024-09-02 09:00:00',5,NULL),(14,14,'Liked article','2024-09-02 10:30:00',6,NULL),(15,15,'Shared article','2024-09-02 11:00:00',7,NULL),(16,16,'Commented on article','2024-09-02 12:15:00',8,5),(17,17,'Viewed article','2024-09-02 13:00:00',9,NULL),(18,18,'Liked article','2024-09-02 14:30:00',10,NULL),(19,19,'Commented on article','2024-09-02 15:00:00',6,6),(20,20,'Shared article','2024-09-02 16:15:00',8,NULL),(21,21,'Viewed article','2024-09-02 17:00:00',10,NULL),(22,22,'Liked article','2024-09-02 18:30:00',1,NULL),(23,23,'Commented on article','2024-09-02 19:00:00',7,7),(24,24,'Viewed article','2024-09-03 09:15:00',2,NULL),(25,25,'Shared article','2024-09-03 10:00:00',5,NULL),(26,26,'Liked article','2024-09-03 11:30:00',3,NULL),(27,27,'Commented on article','2024-09-03 12:00:00',9,8),(28,28,'Viewed article','2024-09-03 13:30:00',4,NULL),(29,29,'Liked article','2024-09-03 14:00:00',7,NULL),(30,30,'Shared article','2024-09-03 15:15:00',2,NULL);
/*!40000 ALTER TABLE `UserActivityLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `bio` text,
  `profile_picture` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'john_doe','john.doe@example.com','hash1','Student','I am a student of computer science.','profile1.jpg','facebook.com/john_doe','twitter.com/john_doe','linkedin.com/john_doe','2024-09-12 23:15:41','2024-09-12 23:15:41'),(2,'jane_smith','jane.smith@example.com','hash2','Facilitator','Facilitator in software engineering courses.','profile2.jpg','facebook.com/jane_smith','twitter.com/jane_smith','linkedin.com/jane_smith','2024-09-12 23:15:41','2024-09-12 23:15:41'),(3,'michael_brown','michael.brown@example.com','hash3','Student','Passionate about AI and ML.','profile3.jpg','facebook.com/michael_brown','twitter.com/michael_brown','linkedin.com/michael_brown','2024-09-12 23:15:41','2024-09-12 23:15:41'),(4,'susan_wilson','susan.wilson@example.com','hash4','Super Admin','Admin of the learning platform.','profile4.jpg','facebook.com/susan_wilson','twitter.com/susan_wilson','linkedin.com/susan_wilson','2024-09-12 23:15:41','2024-09-12 23:15:41'),(5,'linda_johnson','linda.johnson@example.com','hash5','Student','Avid reader and programmer.','profile5.jpg','facebook.com/linda_johnson','twitter.com/linda_johnson','linkedin.com/linda_johnson','2024-09-12 23:15:41','2024-09-12 23:15:41'),(6,'kevin_clark','kevin.clark@example.com','hash6','Facilitator','Teaching programming fundamentals.','profile6.jpg','facebook.com/kevin_clark','twitter.com/kevin_clark','linkedin.com/kevin_clark','2024-09-12 23:15:41','2024-09-12 23:15:41'),(7,'emma_lee','emma.lee@example.com','hash7','Student','Pursuing a degree in data science.','profile7.jpg','facebook.com/emma_lee','twitter.com/emma_lee','linkedin.com/emma_lee','2024-09-12 23:15:41','2024-09-12 23:15:41'),(8,'daniel_moore','daniel.moore@example.com','hash8','Super Admin','Managing the platform infrastructure.','profile8.jpg','facebook.com/daniel_moore','twitter.com/daniel_moore','linkedin.com/daniel_moore','2024-09-12 23:15:41','2024-09-12 23:15:41'),(9,'olivia_martin','olivia.martin@example.com','hash9','Facilitator','Specializes in database systems.','profile9.jpg','facebook.com/olivia_martin','twitter.com/olivia_martin','linkedin.com/olivia_martin','2024-09-12 23:15:41','2024-09-12 23:15:41'),(10,'noah_taylor','noah.taylor@example.com','hash10','Student','Learning web development.','profile10.jpg','facebook.com/noah_taylor','twitter.com/noah_taylor','linkedin.com/noah_taylor','2024-09-12 23:15:41','2024-09-12 23:15:41'),(11,'ava_thomas','ava.thomas@example.com','hash11','Student','Interested in cybersecurity.','profile11.jpg','facebook.com/ava_thomas','twitter.com/ava_thomas','linkedin.com/ava_thomas','2024-09-12 23:15:41','2024-09-12 23:15:41'),(12,'william_jackson','william.jackson@example.com','hash12','Facilitator','Teaching advanced machine learning.','profile12.jpg','facebook.com/william_jackson','twitter.com/william_jackson','linkedin.com/william_jackson','2024-09-12 23:15:41','2024-09-12 23:15:41'),(13,'mia_white','mia.white@example.com','hash13','Student','Working on front-end development skills.','profile13.jpg','facebook.com/mia_white','twitter.com/mia_white','linkedin.com/mia_white','2024-09-12 23:15:41','2024-09-12 23:15:41'),(14,'james_harris','james.harris@example.com','hash14','Super Admin','Oversees user administration.','profile14.jpg','facebook.com/james_harris','twitter.com/james_harris','linkedin.com/james_harris','2024-09-12 23:15:41','2024-09-12 23:15:41'),(15,'sophia_clark','sophia.clark@example.com','hash15','Facilitator','Python programming enthusiast.','profile15.jpg','facebook.com/sophia_clark','twitter.com/sophia_clark','linkedin.com/sophia_clark','2024-09-12 23:15:41','2024-09-12 23:15:41'),(16,'benjamin_lopez','benjamin.lopez@example.com','hash16','Student','Aspiring data scientist.','profile16.jpg','facebook.com/benjamin_lopez','twitter.com/benjamin_lopez','linkedin.com/benjamin_lopez','2024-09-12 23:15:41','2024-09-12 23:15:41'),(17,'chloe_scott','chloe.scott@example.com','hash17','Super Admin','Handles system-wide updates.','profile17.jpg','facebook.com/chloe_scott','twitter.com/chloe_scott','linkedin.com/chloe_scott','2024-09-12 23:15:41','2024-09-12 23:15:41'),(18,'mason_adams','mason.adams@example.com','hash18','Facilitator','Instructor for cloud computing courses.','profile18.jpg','facebook.com/mason_adams','twitter.com/mason_adams','linkedin.com/mason_adams','2024-09-12 23:15:41','2024-09-12 23:15:41'),(19,'ella_nelson','ella.nelson@example.com','hash19','Student','Learning backend development.','profile19.jpg','facebook.com/ella_nelson','twitter.com/ella_nelson','linkedin.com/ella_nelson','2024-09-12 23:15:41','2024-09-12 23:15:41'),(20,'lucas_carter','lucas.carter@example.com','hash20','Super Admin','Overseeing content management.','profile20.jpg','facebook.com/lucas_carter','twitter.com/lucas_carter','linkedin.com/lucas_carter','2024-09-12 23:15:41','2024-09-12 23:15:41'),(21,'harper_mitchell','harper.mitchell@example.com','hash21','Student','Exploring full-stack development.','profile21.jpg','facebook.com/harper_mitchell','twitter.com/harper_mitchell','linkedin.com/harper_mitchell','2024-09-12 23:15:41','2024-09-12 23:15:41'),(22,'jackson_perez','jackson.perez@example.com','hash22','Facilitator','Specialist in web security.','profile22.jpg','facebook.com/jackson_perez','twitter.com/jackson_perez','linkedin.com/jackson_perez','2024-09-12 23:15:41','2024-09-12 23:15:41'),(23,'emily_roberts','emily.roberts@example.com','hash23','Student','Avid coder and data analyst.','profile23.jpg','facebook.com/emily_roberts','twitter.com/emily_roberts','linkedin.com/emily_roberts','2024-09-12 23:15:41','2024-09-12 23:15:41'),(24,'henry_turner','henry.turner@example.com','hash24','Super Admin','Maintaining system integrity.','profile24.jpg','facebook.com/henry_turner','twitter.com/henry_turner','linkedin.com/henry_turner','2024-09-12 23:15:41','2024-09-12 23:15:41'),(25,'amelia_morgan','amelia.morgan@example.com','hash25','Student','Learning mobile app development.','profile25.jpg','facebook.com/amelia_morgan','twitter.com/amelia_morgan','linkedin.com/amelia_morgan','2024-09-12 23:15:41','2024-09-12 23:15:41'),(26,'elijah_brooks','elijah.brooks@example.com','hash26','Facilitator','Specializing in DevOps practices.','profile26.jpg','facebook.com/elijah_brooks','twitter.com/elijah_brooks','linkedin.com/elijah_brooks','2024-09-12 23:15:41','2024-09-12 23:15:41'),(27,'abigail_watson','abigail.watson@example.com','hash27','Student','Interested in AI and robotics.','profile27.jpg','facebook.com/abigail_watson','twitter.com/abigail_watson','linkedin.com/abigail_watson','2024-09-12 23:15:41','2024-09-12 23:15:41'),(28,'alexander_bailey','alexander.bailey@example.com','hash28','Super Admin','Ensuring data security.','profile28.jpg','facebook.com/alexander_bailey','twitter.com/alexander_bailey','linkedin.com/alexander_bailey','2024-09-12 23:15:41','2024-09-12 23:15:41'),(29,'isabella_reed','isabella.reed@example.com','hash29','Facilitator','Specializing in AI and ML courses.','profile29.jpg','facebook.com/isabella_reed','twitter.com/isabella_reed','linkedin.com/isabella_reed','2024-09-12 23:15:41','2024-09-12 23:15:41'),(30,'logan_hill','logan.hill@example.com','hash30','Student','Exploring cloud architecture.','profile30.jpg','facebook.com/logan_hill','twitter.com/logan_hill','linkedin.com/logan_hill','2024-09-12 23:15:41','2024-09-12 23:15:41');
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

-- Dump completed on 2024-09-16 12:50:41

-- Table structure for table `AdminProfile`
DROP TABLE IF EXISTS `AdminProfile`;
CREATE TABLE `AdminProfile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `administrative_privileges` json DEFAULT NULL,
  `system_configurations` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `admin_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample data for `AdminProfile`
INSERT INTO `AdminProfile` (`id`, `user_id`, `administrative_privileges`, `system_configurations`, `created_at`)
VALUES
(1, 1, '{"manageUsers": true, "accessReports": true}', '{"theme": "dark", "timezone": "UTC"}', '2024-09-12 23:49:25'),
(2, 2, '{"manageUsers": true}', '{"theme": "light", "timezone": "PST"}', '2024-09-12 23:49:25'),
(3, 3, '{"manageContent": true}', '{"theme": "dark", "timezone": "EST"}', '2024-09-12 23:49:25');

-- Table structure for table `FacilitatorProfile`
DROP TABLE IF EXISTS `FacilitatorProfile`;
CREATE TABLE `FacilitatorProfile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `expertise` text DEFAULT NULL,
  `roles` text DEFAULT NULL,
  `contributions` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `facilitator_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample data for `FacilitatorProfile`
INSERT INTO `FacilitatorProfile` (`id`, `user_id`, `expertise`, `roles`, `contributions`, `created_at`)
VALUES
(1, 4, 'Mathematics, Physics', 'Tutor', '{"articlesPublished": 5}', '2024-09-12 23:49:25'),
(2, 5, 'Computer Science', 'Mentor', '{"coursesCreated": 3, "studentsMentored": 20}', '2024-09-12 23:49:25'),
(3, 6, 'Biology', 'Instructor', '{"workshopsHosted": 2}', '2024-09-12 23:49:25');


-- Table structure for table `StudentProfile`
DROP TABLE IF EXISTS `StudentProfile`;
CREATE TABLE `StudentProfile` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `educational_background` text DEFAULT NULL,
  `career_interests` text DEFAULT NULL,
  `past_interactions` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `student_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample data for `StudentProfile`
INSERT INTO `StudentProfile` (`id`, `user_id`, `educational_background`, `career_interests`, `past_interactions`, `created_at`)
VALUES
(1, 7, 'High School Diploma', 'Software Engineering', '{"coursesCompleted": 10, "certifications": 2}', '2024-09-12 23:49:25'),
(2, 8, 'Bachelor of Science in Biology', 'Medical Research', '{"seminarsAttended": 4, "groupProjects": 2}', '2024-09-12 23:49:25'),
(3, 9, 'Bachelor of Arts in English Literature', 'Journalism', '{"articlesWritten": 3}', '2024-09-12 23:49:25');

