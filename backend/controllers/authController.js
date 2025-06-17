import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "../config/db.js"; 

export const register = async (req, res, next) => {
  const { username, email, phone, password } = req.body;

  try {
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await sql`
      INSERT INTO users (username, email, phone, password)
      VALUES (${username}, ${email}, ${phone}, ${hashedPassword})
      RETURNING *
    `;

    const user = userResult[0];

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.status(201).json({ msg: "Registration successful", token, user: { id: user.id, email: user.email, isAdmin: user.is_admin } });
  } catch (err) {
    next(err);
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.status(200).json({ message: "Login successful", token, user: { id: user.id, email: user.email, isAdmin: user.is_admin } });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
