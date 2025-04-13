const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error for debugging

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Stack only in dev
  });
};

export default errorHandler;
