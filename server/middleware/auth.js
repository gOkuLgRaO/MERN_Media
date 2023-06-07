// when authentication is done in in controllers/auth.js and routes/auth.js, now its time for authorization. only the logged in user has the authority to enable changes in website

import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization"); // we are grabbing the authorization header from request body and setting it as token

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft(); // remove the first 7 letters from token and grab the rest
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET); // verify the token grabbed with jwt secret in env file
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};