-- Based on 2.2 
-- Order 3
USE KeelCompass_dev;

RENAME TABLE QuestionCategory TO QuestionCategories;

ALTER TABLE QuestionCategories DROP FOREIGN KEY `QuestionCategory_Questions_FK`;
ALTER TABLE QuestionCategories ADD CONSTRAINT `QuestionCategories_Questions_FK` FOREIGN KEY (`question_d`) REFERENCES Questions(`id`) ON DELETE CASCADE;

ALTER TABLE QuestionCategories DROP FOREIGN KEY `QuestionCategory_Categories_FK`;
ALTER TABLE QuestionCategories ADD CONSTRAINT `QuestionCategories_Categories_FK` FOREIGN KEY (`category_id`) REFERENCES Categories(`id`) ON DELETE CASCADE;