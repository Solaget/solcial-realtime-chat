const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode || 500;
  const message = err.message || "Internal Server error";
  console.log(statusCode);

  res.status(statusCode).json({
    message,
  });
};

export default errorHandler;
