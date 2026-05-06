import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticate(req, res, next) {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json({
      error: "User not authenticated"
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}
