const responseObject = ({
  res,
  status,
  type,
  message = "",
  data = null,
  error = null,
}) => {
  return res.status(status).json({
    type,
    message,
    data,
    error,
  });
};

module.exports = responseObject;
