const bcrypt = require("bcrypt");
const moment = require("moment");

const sequelize = require("../models/index");
const db = require("../models");

// Destructure the models from db
const { StudentProfile, FacilitatorProfile, AdminProfile, users: User } = db;

// A health check method to check db connection status
const healthCheck = async (req, res) => {
  try {
    await sequelize.sequelize.authenticate();
    res.send("Connection established successfully.");
  } catch (error) {
    res.status(500).send("Connection failed.");
  }
};

// A utility function to round the current time to the nearest 15-minute interval
const getRoundedTimestamp = () => {
  const currentTime = moment();
  const remainder = currentTime.minute() % 15;

  if (remainder === 0) {
    return currentTime;
  } else if (remainder < 7.5) {
    return currentTime.subtract(remainder, "minutes").second(0); // round down
  } else {
    return currentTime.add(15 - remainder, "minutes").second(0); // round up
  }
};

// Password reset method to generate OTP
const passwordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the rounded timestamp
    const roundedTime = getRoundedTimestamp().unix();

    // Generate a hash using username, password_hash, and rounded timestamp
    const otpPayload = `${user.username}${user.password_hash}${roundedTime}`;
    const otpHash = await bcrypt.hash(otpPayload, 10);

    // Send the first 6 characters of the OTP hash as OTP to the user
    const otp = otpHash.slice(0, 6);

    // Store OTP generation info in the session
    req.session.otpGenerated = true;
    req.session.email = email; // Store email in the session for validation
    req.session.save(); // Ensure session is saved

    res.status(200).json({
      message: "OTP generated successfully",
      otp,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// OTP verification method
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  // Check if OTP was generated
  if (!req.session.otpGenerated || req.session.email !== email) {
    return res
      .status(400)
      .json({ message: "OTP not generated or session expired" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roundedTime = getRoundedTimestamp().unix();
    const otpPayload = `${user.username}${user.password_hash}${roundedTime}`;
    const expectedOtpHash = await bcrypt.hash(otpPayload, 10);
    const expectedOtp = expectedOtpHash.slice(0, 6);

    if (otp === expectedOtp) {
      // Mark OTP as verified in session
      req.session.otpVerified = true;
      req.session.save();

      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// Update password method (requires new password)
const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Check if OTP was verified before allowing password update
  if (!req.session.otpVerified || req.session.email !== email) {
    return res
      .status(400)
      .json({ message: "OTP not verified or session expired" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await user.update({ password_hash: hashedPassword });

    // Clear session after password update
    req.session.destroy();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// Sign-up method to handle different roles
const signUp = async (req, res) => {
  const { username, email, password, role, additionalInfo } = req.body;

  try {
    const password_hash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      email,
      password_hash,
      role,
    });

    // Create role-specific profile
    if (role === "Student") {
      await StudentProfile.create({
        user_id: user.id,
        ...additionalInfo, // { educational_background, career_interests, past_interactions }
      });
    } else if (role === "Facilitator") {
      await FacilitatorProfile.create({
        user_id: user.id,
        ...additionalInfo, // { expertise, roles, contributions }
      });
    } else if (role === "Super Admin") {
      await AdminProfile.create({
        user_id: user.id,
        ...additionalInfo, // { administrative_privileges, system_configurations }
      });
    }

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let profile;
    if (user.role === "Student") {
      profile = await StudentProfile.findOne({ where: { user_id: user.id } });
    } else if (user.role === "Facilitator") {
      profile = await FacilitatorProfile.findOne({
        where: { user_id: user.id },
      });
    } else if (user.role === "Super Admin") {
      profile = await AdminProfile.findOne({ where: { user_id: user.id } });
    }

    res.status(200).json({ user, profile });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { profileData } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "Student") {
      await StudentProfile.update(profileData, { where: { user_id: user.id } });
    } else if (user.role === "Facilitator") {
      await FacilitatorProfile.update(profileData, {
        where: { user_id: user.id },
      });
    } else if (user.role === "Super Admin") {
      await AdminProfile.update(profileData, { where: { user_id: user.id } });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

module.exports = {
  healthCheck,
  passwordReset,
  verifyOTP,
  updatePassword,
  updateProfile,
  getProfile,
  signUp,
};
