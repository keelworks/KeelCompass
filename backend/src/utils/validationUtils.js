const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array();
    // same { status, error, message } shape the global error handler uses,
    // so the frontend's shared error-message extraction works for
    // validation failures too instead of only ever showing a generic
    // fallback - "errors" stays available for any caller that wants the
    // full per-field list
    return res.status(400).json({
      status: 400,
      error: "Bad Request",
      message: details[0]?.msg || "Invalid request.",
      errors: details,
    });
  }
  next();
};

module.exports = {
  handleValidationErrors,
};
