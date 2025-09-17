'use strict';

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, _) {
    console.log('Seeding Categories...');
    // seed categories
    await queryInterface.bulkInsert("Categories", [
      { id: 1, name: "Career Development" },
      { id: 2, name: "Job Search" },
      { id: 3, name: "Education" },
      { id: 4, name: "Keelworks" },
    ]);

    console.log('Seeding Users...');
    // seed users (with roles)
    const passwordHash = bcrypt.hashSync("Password1", 10);
    await queryInterface.bulkInsert("Users", [
      { id: 1, username: "johndoe", email: "john@example.com", password: passwordHash, role: "volunteer" },
      { id: 2, username: "janedoe", email: "jane@example.com", password: passwordHash, role: "volunteer" },
      { id: 3, username: "thomasgarrod", email: "thomas@example.com", password: passwordHash, role: "facilitator" },
    ]);

    console.log('Seeding Questions...');
    // seed questions (with status)
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

    // seed question categories
    await queryInterface.bulkInsert("QuestionCategories", [
      { question_id: 1, category_id: 1 },
      { question_id: 2, category_id: 3 },
      { question_id: 3, category_id: 1 },
      { question_id: 3, category_id: 2 },
      { question_id: 4, category_id: 2 },
      // question 5 → no category
      { question_id: 6, category_id: 1 },
      { question_id: 6, category_id: 3 },
      { question_id: 7, category_id: 4 },
      { question_id: 8, category_id: 1 },
      { question_id: 8, category_id: 2 },
      { question_id: 8, category_id: 4 },
      // question 9 → no category
      { question_id: 10, category_id: 5 },
    ]);

    console.log('Seeding UserQuestionActions...');
    // seed likes and reports to questions
    await queryInterface.bulkInsert("UserQuestionActions", [
      { user_id: 2, question_id: 1, action_type: "like" },
      { user_id: 1, question_id: 2, action_type: "report" },
    ]);

    console.log('Seeding Comments...');
    // seed comments
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

    console.log('Seeding threaded comment...');
    // seed a threaded comment (reply to comment 1)
    await queryInterface.bulkInsert("Comments", [
      { id: 11, user_id: 1, question_id: 1, parent_id: 1, content: "Reply to comment 1" }
    ]);

    console.log('Seeding UserCommentActions...');
    // seed likes and reports to comments
    await queryInterface.bulkInsert("UserCommentActions", [
      { user_id: 1, comment_id: 1, action_type: "like" },
      { user_id: 2, comment_id: 2, action_type: "report" },
    ]);

    console.log('Seeding Attachments...');
    // seed attachments
    await queryInterface.bulkInsert("Attachments", [
      {
        id: 1,
        question_id: 1,
        comment_id: null,
        file_name: "resume.pdf",
        mime_type: "application/pdf",
        data: Buffer.from("Sample PDF content"),
        created_at: new Date()
      },
      {
        id: 2,
        question_id: null,
        comment_id: 1,
        file_name: "feedback.png",
        mime_type: "image/png",
        data: Buffer.from("Sample PNG content"),
        created_at: new Date()
      }
    ]);

    console.log('Seeding Interests...');
    // seed interests
    await queryInterface.bulkInsert("Interests", [
      { user_id: 1, question_id: 2 },
      { user_id: 2, comment_id: 1 }
    ]);

    console.log('Seeding Notifications...');
    // seed notifications
    const notifications = [
      { user_id: 1, question_id: 1, type: "approved", message: "Your question has been approved.", read: false },
      { user_id: 1, question_id: 1, type: "rejected", message: "Your question was rejected.", read: false },
      { user_id: 1, question_id: 1, type: "liked", message: "Someone liked your question.", read: false },
      { user_id: 1, question_id: 1, type: "reported", message: "Someone reported your question.", read: false },
      { user_id: 1, comment_id: 1, type: "liked", message: "Someone liked your comment.", read: false },
      { user_id: 1, comment_id: 1, type: "reported", message: "Someone reported your comment.", read: false },
      { user_id: 1, question_id: 1, type: "updated", message: "A question you bookmarked has been updated.", read: false },
      { user_id: 1, comment_id: 1, type: "bookmarked", message: "Your comment was bookmarked.", read: false },
      { user_id: 1, type: "announcement", message: "Check out what's new.", read: false },
      { user_id: 2, question_id: 2, type: "approved", message: "Your question has been approved.", read: false },
      { user_id: 2, question_id: 2, type: "rejected", message: "Your question was rejected.", read: false },
      { user_id: 2, question_id: 2, type: "liked", message: "Someone liked your question.", read: false },
      { user_id: 2, question_id: 2, type: "reported", message: "Someone reported your question.", read: false },
      { user_id: 2, comment_id: 2, type: "liked", message: "Someone liked your comment.", read: false },
      { user_id: 2, comment_id: 2, type: "reported", message: "Someone reported your comment.", read: false },
      { user_id: 2, question_id: 2, type: "updated", message: "A question you bookmarked has been updated.", read: false },
      { user_id: 2, question_id: 2, type: "bookmarked", message: "Your question was bookmarked.", read: false },
      { user_id: 2, type: "announcement", message: "Check out what's new.", read: false },
    ];
    await queryInterface.bulkInsert("Notifications", notifications);
  },

  async down(queryInterface, _) {
    // Delete in strict reverse order of insertion to avoid FK constraint errors
    await queryInterface.bulkDelete("Notifications", null, {});
    await queryInterface.bulkDelete("Interests", null, {});
    await queryInterface.bulkDelete("Attachments", null, {});
    await queryInterface.bulkDelete("UserCommentActions", null, {});
    await queryInterface.bulkDelete("Comments", null, {});
    await queryInterface.bulkDelete("UserQuestionActions", null, {});
    await queryInterface.bulkDelete("QuestionCategories", null, {});
    await queryInterface.bulkDelete("Questions", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
  }
};
