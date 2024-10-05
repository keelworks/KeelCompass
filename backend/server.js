const app = require("./src/app.js");

// using dotenv for accessing environment variables
require("dotenv").config();

const PORT = process.env.PORT || 8080; // Add a default port if not provided

// server listening on port <PORT> for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
