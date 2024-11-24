const bcrypt = require('bcryptjs');
const { User } = require('../models/userV2');
require("dotenv").config();  // Make sure this path is correct

// // Find user by username
// const findUserByUsername = async (username) => {
//     try {
//         const user = await User.findOne({ where: { username } });
//         return user;
//     } catch (error) {
//         throw new Error('Error finding user by username');
//     }
// };

// // Create a new user
// const createUser = async (userData) => {
//     try {
//         const user = await User.create({
//             username: userData.username,
//             email: userData.email,
//             password: userData.password, // Store the plain password temporarily before hashing
//         });
//         return user;
//     } catch (error) {
//         throw new Error('Error creating user');
//     }
// };

// // Hash password
// const hashPassword = async (password, saltRounds) => {
//     try {
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         return hashedPassword;
//     } catch (error) {
//         throw new Error('Error hashing password');
//     }
// };

// // Compare password
// const comparePassword = async (password, hash) => {
//     try {
//         const isMatch = await bcrypt.compare(password, hash);
//         return isMatch;
//     } catch (error) {
//         throw new Error('Error comparing passwords');
//     }
// };

// module.exports = { findUserByUsername, createUser, hashPassword, comparePassword };
