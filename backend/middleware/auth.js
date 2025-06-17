import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await sql`SELECT * FROM users WHERE id = ${decoded.userId}`;


    if (!user.length) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    req.user = user[0];
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized. Invalid token." });
  }
};
