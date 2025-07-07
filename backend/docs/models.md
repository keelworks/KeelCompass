# KeelCompass Backend Models

This document provides a reference of all Sequelize models in the backend, including their key fields and relationships. It is intended to help developers understand the database structure, how models relate to each other, and where to look when reading or modifying backend logic.

All model definitions in this file are derived directly from the source code in the `models/` folder and should stay in sync with any changes made to the database schema.

## Primary Models

### User

#### Fields

- id: Integer
- role: Enum("volunteer", "facilitator")
- username: String(50)
- email: String(100)
- password: String(255)
- created_at: Timestamp
- updated_at: Timestamp

#### Relationships

- questions: One-to-Many
- userQuestionActions: One-to-Many
- comments: One-to-Many
- userCommentActions: One-to-Many
- interests: One-to-Many
- notifications: One-to-Many

### Category

#### Fields

#### Relationships

### Question

#### Fields

#### Relationships

### UserQuestionAction

#### Fields

#### Relationships

### Comment

#### Fields

#### Relationships

### UserCommentAction

#### Fields

#### Relationships

### Attachment

#### Fields

#### Relationships

### Interest

#### Fields

#### Relationships

### Notification

#### Fields

#### Relationships

## Join Tables

### QuestionCategory

#### Fields

#### Relationships
