const logger = require("./logger");

function logEverything(obj, prefix = "") {
  try {
    const pre = prefix ? `[${prefix}] ` : "";
    logger.error(`${pre}Raw:`, obj);
    if (obj && obj.message) logger.error(`${pre}Message:`, obj.message);
    if (obj && obj.stack) logger.error(`${pre}Stack:`, obj.stack);
    if (obj && obj.sql) logger.error(`${pre}SQL:`, obj.sql);
    // Log all own properties
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        logger.error(`${pre}Property ${key}:`, obj[key]);
      });
      // Log prototype properties
      Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).forEach(key => {
        if (key !== 'constructor') {
          try {
            logger.error(`${pre}Proto ${key}:`, obj[key]);
          } catch {}
        }
      });
    }
    // JSON serialization
    try {
      logger.error(`${pre}JSON:`, JSON.stringify(obj));
    } catch (e) {
      logger.error(`${pre}JSON stringify failed:`, e);
    }
    // Circular-safe inspection
    try {
      const util = require('util');
      logger.error(`${pre}Inspect:`, util.inspect(obj, { showHidden: false, depth: null }));
    } catch (e) {
      logger.error(`${pre}util.inspect failed:`, e);
    }
  } catch (err) {
    logger.error("logEverything itself failed:", err);
  }
}

module.exports = logEverything;
