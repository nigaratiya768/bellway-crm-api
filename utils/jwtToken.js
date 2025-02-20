//const COOKIE_EXPIRE=5;
//create token and save in cookie

//TODO to undo
const sendToken = (agent, statusCode, res) => {
  const token = agent.getJWTToken();

  /// option for coockie
  const options = {
    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), //changed happened
    httpOnly: true,
  };

  //console.log(options)
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message: "Login Successfully",
    agent,

    token,
  });
};

module.exports = sendToken;
