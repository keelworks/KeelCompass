class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const HttpStatusCodes = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  CONFLICT: 409
});

const ServiceErrorHandler = (error, res, logger, serviceName) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    logger.error(`Service ${serviceName} error: ` + error.message || error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

module.exports = {
  HttpStatusCodes,
  HttpError,
  ServiceErrorHandler,
};
