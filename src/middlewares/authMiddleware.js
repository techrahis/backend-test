import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authorization header is missing or invalid.");
      error.status = 401;
      throw error;
    }

    // ✅ Extract the token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to controller
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      error.status = 401;
      error.message = "Invalid token.";
    } else if (error.name === "TokenExpiredError") {
      error.status = 401;
      error.message = "Token expired.";
    } else {
      error.status = 500;
    }
    next(error);
  }
};

export default authMiddleware;
