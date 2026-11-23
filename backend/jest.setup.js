// Jest sets NODE_ENV to "test" automatically, which dbConfig.js doesn't
// recognize (it only auto-loads .env for "development") - load it here
// instead so tests connect to the same local DB the dev server uses.
require("dotenv").config({ path: ".env" });
