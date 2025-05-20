const bcrypt = require("bcryptjs");
const db = require("../src/models");
const logger = require("../src/utils/logger");

const seed = async () => {
  try {
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.sequelize.sync();
    logger.info("Database synced.");
    await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    // Seed Categories
    await db.categories.bulkCreate([
      { name: "Career Development" },
      { name: "Job Search" },
      { name: "Education" },
      { name: "Keelworks" },
      { name: "KCompass Help" },
    ]);
    logger.info("Categories seeded.");

    // Seed Users
    const passwordHash = bcrypt.hashSync("Password1", 10);
    const users = await db.users.bulkCreate([
      { username: "john_doe", email: "john@example.com", password: passwordHash },
      { username: "jane_doe", email: "jane@example.com", password: passwordHash },
    ]);
    const john = users[0];
    const jane = users[1];
    logger.info("Users seeded.");

    // Seed Questions (alternating John/Jane)
    const questions = await db.questions.bulkCreate([
      { user_id: john.id, title: "What are the best programming languages for jobs?", description: "I am looking to transition into a programming career. What languages should I focus on?" },
      { user_id: jane.id, title: "How to improve resume for education roles?", description: "What are the key points that make a resume stand out for roles in education?" },
      { user_id: john.id, title: "Is a degree necessary for software jobs?", description: "Can I land a good software development job without a formal degree?" },
      { user_id: jane.id, title: "What are the best platforms for job preparation?", description: "I want to prepare for job interviews. Are there any specific platforms you recommend?" },
      { user_id: john.id, title: "How to excel in teaching roles?", description: "I am about to start my career as a teacher. Any tips to excel in this profession?" },
      { user_id: jane.id, title: "What certifications are helpful for education professionals?", description: "Are there any certifications that add value to a career in education?" },
      { user_id: john.id, title: "How to switch from education to IT jobs?", description: "What are the best steps to move from teaching to IT roles?" },
      { user_id: jane.id, title: "What is the future of remote jobs?", description: "Will remote work continue to grow, and how can I find the best opportunities?" },
      { user_id: john.id, title: "How to gain experience in the education field?", description: "I am new to the field of education. How can I gain practical experience?" },
      { user_id: jane.id, title: "What are the highest-paying IT jobs?", description: "Can you provide a list of the highest-paying IT roles currently?" },
    ]);
    logger.info("Questions seeded.");

    // Seed Comments
    const comments = await db.comments.bulkCreate([
      { user_id: jane.id, question_id: questions[0].id, content: "Python is indeed a great choice, but don’t overlook Java for jobs in enterprise solutions." },
      { user_id: john.id, question_id: questions[1].id, content: "If you have experience tutoring or mentoring, it’s worth highlighting those skills." },
      { user_id: jane.id, question_id: questions[2].id, content: "Online bootcamps can be helpful for people without formal education in development." },
      { user_id: john.id, question_id: questions[3].id, content: "Networking at local meetups can help you find jobs as a fresher." },
      { user_id: jane.id, question_id: questions[4].id, content: "It’s great that teaching opportunities are available; have you looked into private schools?" },
      { user_id: john.id, question_id: questions[5].id, content: "Platforms like Coursera have specialized certifications that may help in teaching." },
      { user_id: jane.id, question_id: questions[6].id, content: "Transitioning to IT can be daunting, but internships or apprenticeships are a good start." },
      { user_id: john.id, question_id: questions[7].id, content: "I’ve used AngelList before; it’s great for finding startup roles." },
      { user_id: jane.id, question_id: questions[8].id, content: "Have you thought about volunteering with an education-focused nonprofit?" },
      { user_id: john.id, question_id: questions[9].id, content: "Becoming a Data Scientist often requires strong statistical and machine learning skills." },
    ]);
    logger.info("Comments seeded.");

    // Seed UserQuestionActions
    await db.userQuestionActions.bulkCreate([
      { user_id: jane.id, question_id: questions[0].id, action_type: 'like' },
      { user_id: john.id, question_id: questions[1].id, action_type: 'report' },
    ]);
    logger.info("UserQuestionActions seeded.");

    // Seed UserCommentActions
    await db.userCommentActions.bulkCreate([
      { user_id: john.id, comment_id: comments[0].id, action_type: 'like' },
      { user_id: jane.id, comment_id: comments[1].id, action_type: 'report' },
    ]);
    logger.info("UserCommentActions seeded.");

    // Seed Interests
    await db.interests.bulkCreate([
      { user_id: john.id, comment_id: comments[0].id },
      { user_id: jane.id, question_id: questions[0].id },
    ]);
    logger.info("Interests seeded.");

    // Seed Notifications
    await db.notifications.bulkCreate([
      // For John
      { user_id: john.id, type: "question_approved", message: "Your question has been approved.", read: false },
      { user_id: john.id, type: "question_rejected", message: "Your question was rejected.", read: false },
      { user_id: john.id, type: "question_liked", message: "Someone liked your question.", read: false },
      { user_id: john.id, type: "question_reported", message: "Someone reported your question.", read: false },
      { user_id: john.id, type: "comment_liked", message: "Someone liked your comment.", read: false },
      { user_id: john.id, type: "comment_reported", message: "Someone reported your comment.", read: false },
      { user_id: john.id, type: "question_updated", message: "A question you bookmarked has been updated.", read: false },
      { user_id: john.id, type: "announcement", message: "Check out what's new.", read: false },

      // For Jane
      { user_id: jane.id, type: "question_approved", message: "Your question has been approved.", read: false },
      { user_id: jane.id, type: "question_rejected", message: "Your question was rejected.", read: false },
      { user_id: jane.id, type: "question_liked", message: "Someone liked your question.", read: false },
      { user_id: jane.id, type: "question_reported", message: "Someone reported your question.", read: false },
      { user_id: jane.id, type: "comment_liked", message: "Someone liked your comment.", read: false },
      { user_id: jane.id, type: "comment_reported", message: "Someone reported your comment.", read: false },
      { user_id: jane.id, type: "question_updated", message: "A question you bookmarked has been updated.", read: false },
      { user_id: jane.id, type: "announcement", message: "Check out what's new.", read: false },
    ]);
    logger.info("Notifications seeded.");

    logger.info("✅ Seeding complete.");
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seed();
