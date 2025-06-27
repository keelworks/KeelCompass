'use strict';

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, _) {
    // Seed Categories
    await queryInterface.bulkInsert("Categories", [
      { id: 1, name: "Career Development" },
      { id: 2, name: "Job Search" },
      { id: 3, name: "Education" },
      { id: 4, name: "Keelworks" },
      { id: 5, name: "KCompass Help" },
    ]);

    // Seed Users (with roles)
    const passwordHash = bcrypt.hashSync("Password1", 10);
    await queryInterface.bulkInsert("Users", [
      { id: 1, username: "john_doe", email: "john@example.com", password: passwordHash, role: "volunteer" },
      { id: 2, username: "jane_doe", email: "jane@example.com", password: passwordHash, role: "volunteer" },
      { id: 3, username: "thomas_garrod", email: "thomas@example.com", password: passwordHash, role: "facilitator" },
    ]);

    // Seed Questions (with status)
    await queryInterface.bulkInsert("Questions", [
      {
        id: 1,
        user_id: 1,
        title: "What are the best programming languages for jobs?",
        description: "I am looking to transition into a programming career. What languages should I focus on?",
        status: "approved"
      },
      {
        id: 2,
        user_id: 2,
        title: "How to improve resume for education roles?",
        description: "What are the key points that make a resume stand out for roles in education?",
        status: "approved"
      },
      {
        id: 3,
        user_id: 1,
        title: "Is a degree necessary for software jobs?",
        description: "Can I land a good software development job without a formal degree?",
        status: "pending"
      },
      {
        id: 4,
        user_id: 2,
        title: "What are the best platforms for job preparation?",
        description: "I want to prepare for job interviews. Are there any specific platforms you recommend?",
        status: "pending"
      },
      {
        id: 5,
        user_id: 1,
        title: "How to excel in teaching roles?",
        description: "I am about to start my career as a teacher. Any tips to excel in this profession?",
        status: "approved"
      },
      {
        id: 6,
        user_id: 2,
        title: "What certifications are helpful for education professionals?",
        description: "Are there any certifications that add value to a career in education?",
        status: "pending"
      },
      {
        id: 7,
        user_id: 1,
        title: "How to switch from education to IT jobs?",
        description: "What are the best steps to move from teaching to IT roles?",
        status: "approved"
      },
      {
        id: 8,
        user_id: 2,
        title: "What is the future of remote jobs?",
        description: "Will remote work continue to grow, and how can I find the best opportunities?",
        status: "pending"
      },
      {
        id: 9,
        user_id: 1,
        title: "How to gain experience in the education field?",
        description: "I am new to the field of education. How can I gain practical experience?",
        status: "approved"
      },
      {
        id: 10,
        user_id: 2,
        title: "What are the highest-paying IT jobs?",
        description: "Can you provide a list of the highest-paying IT roles currently?",
        status: "pending"
      },
    ]);

    // Seed QuestionCategories
    await queryInterface.bulkInsert("QuestionCategories", [
      { question_id: 1, category_id: 1 },
      { question_id: 2, category_id: 3 },
      { question_id: 3, category_id: 1 },
      { question_id: 3, category_id: 2 },
      { question_id: 4, category_id: 2 },
      // Question 5 → No category
      { question_id: 6, category_id: 1 },
      { question_id: 6, category_id: 3 },
      { question_id: 7, category_id: 4 },
      { question_id: 8, category_id: 1 },
      { question_id: 8, category_id: 2 },
      { question_id: 8, category_id: 4 },
      // Question 9 → No category
      { question_id: 10, category_id: 5 },
    ]);

    // Seed Comments
    await queryInterface.bulkInsert("Comments", [
      { id: 1, user_id: 2, question_id: 1, content: "Python is indeed a great choice, but don’t overlook Java for jobs in enterprise solutions." },
      { id: 2, user_id: 1, question_id: 2, content: "If you have experience tutoring or mentoring, it’s worth highlighting those skills." },
      { id: 3, user_id: 2, question_id: 3, content: "Online bootcamps can be helpful for people without formal education in development." },
      { id: 4, user_id: 1, question_id: 4, content: "Networking at local meetups can help you find jobs as a fresher." },
      { id: 5, user_id: 2, question_id: 5, content: "It’s great that teaching opportunities are available; have you looked into private schools?" },
      { id: 6, user_id: 1, question_id: 6, content: "Platforms like Coursera have specialized certifications that may help in teaching." },
      { id: 7, user_id: 2, question_id: 7, content: "Transitioning to IT can be daunting, but internships or apprenticeships are a good start." },
      { id: 8, user_id: 1, question_id: 8, content: "I’ve used AngelList before; it’s great for finding startup roles." },
      { id: 9, user_id: 2, question_id: 9, content: "Have you thought about volunteering with an education-focused nonprofit?" },
      { id: 10, user_id: 1, question_id: 10, content: "Becoming a Data Scientist often requires strong statistical and machine learning skills." },
    ]);

    await queryInterface.bulkInsert("UserQuestionActions", [
      { user_id: 2, question_id: 1, action_type: "like" },
      { user_id: 1, question_id: 2, action_type: "report" },
    ]);

    await queryInterface.bulkInsert("UserCommentActions", [
      { user_id: 1, comment_id: 1, action_type: "like" },
      { user_id: 2, comment_id: 2, action_type: "report" },
    ]);

    await queryInterface.bulkInsert("Interests", [
      { user_id: 1, comment_id: 1 },
      { user_id: 2, question_id: 1 },
    ]);

    const makeNotifications = (user_id) => [
      { user_id, type: "question_approved", message: "Your question has been approved.", read: false },
      { user_id, type: "question_rejected", message: "Your question was rejected.", read: false },
      { user_id, type: "question_liked", message: "Someone liked your question.", read: false },
      { user_id, type: "question_reported", message: "Someone reported your question.", read: false },
      { user_id, type: "comment_liked", message: "Someone liked your comment.", read: false },
      { user_id, type: "comment_reported", message: "Someone reported your comment.", read: false },
      { user_id, type: "question_updated", message: "A question you bookmarked has been updated.", read: false },
      { user_id, type: "announcement", message: "Check out what's new.", read: false },
    ];

    await queryInterface.bulkInsert("Notifications", [
      ...makeNotifications(1),
      ...makeNotifications(2),
    ]);
  },

  async down(queryInterface, _) {
    await queryInterface.bulkDelete("Notifications", null, {});
    await queryInterface.bulkDelete("Interests", null, {});
    await queryInterface.bulkDelete("UserCommentActions", null, {});
    await queryInterface.bulkDelete("UserQuestionActions", null, {});
    await queryInterface.bulkDelete("Comments", null, {});
    await queryInterface.bulkDelete("Questions", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
  }
};
