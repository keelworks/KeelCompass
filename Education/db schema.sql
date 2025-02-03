CREATE DATABASE education_portal;

USE education_portal;

CREATE TABLE EducationalContent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    type ENUM('article', 'guide', 'study_tip', 'learning_strategy'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    content_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
