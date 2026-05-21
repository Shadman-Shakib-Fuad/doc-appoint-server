const jwt = require("jsonwebtoken");

const verifyToken = (
  req,
  res,
  next
) => {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .send({
        message: "Unauthorized",
      });
  }

  const token =
    authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .send({
            message: "Unauthorized",
          });
      }

      req.decoded = decoded;

      next();
    }
  );
};

module.exports = verifyToken;