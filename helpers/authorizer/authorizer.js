const SECRET_KEY = "NOTESAPI";
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req?.headers?.authorization) {
    const token = req?.headers?.authorization;
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.authorId = decoded.id;
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "Invalid Token" });
    }
    next();
  } else
    return res
      .status(401)
      .json({ error: "Missing Token", message: "No Token Found" });
};
