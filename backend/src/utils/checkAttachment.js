module.exports = function checkAttachment(attachment) {
  return Array.isArray(attachment) && attachment.every(item => typeof item === "string");
};
