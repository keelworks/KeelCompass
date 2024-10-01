const app = require("./src/app.js");

//using dotenv for accessing environment variables
require("dotenv").config();

const PORT = `${process.env.PORT}`;

//server listening on port <PORT> for incoming requests
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
