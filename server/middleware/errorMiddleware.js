// Runs when no route matched.
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};


const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server error";

  // Schema validation failed (required field missing, invalid enum...)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Invalid ObjectId in the URL, e.g. /api/jobs/abc
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id format";
  }

  // Duplicate key (unique index violated)
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value: this record already exists";
  }

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };
