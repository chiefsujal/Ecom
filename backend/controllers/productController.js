import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT 
        p.*, 
        COALESCE(AVG(r.rating), 0)::FLOAT AS average_rating,
        COUNT(r.id) AS review_count
      FROM products p
      LEFT JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error in getProducts function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const productResult = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (productResult.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const product = productResult[0];

    const [stats] = await sql`
      SELECT
        AVG(rating)::numeric(2,1) AS average_rating,
        COUNT(*) AS review_count
      FROM reviews
      WHERE product_id = ${id}
    `;

    res.status(200).json({
      success: true,
      data: {
        ...product,
        average_rating: stats.average_rating || 0.0,
        review_count: Number(stats.review_count) || 0,
      },
    });
  } catch (error) {
    console.error("Error in getProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProductWithReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const reviews = await sql`
      SELECT r.*, u.username 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ${id}
      ORDER BY r.created_at DESC
    `;

    res.status(200).json({
      success: true,
      data: {
        product: product[0],
        reviews: reviews,
      },
    });
  } catch (error) {
    console.error("Error in getProductWithReviews function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const newProduct = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${image})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error("Error in createProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const updatedProduct = await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, image = ${image}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updatedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error("Error in updateProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.error("Error in deleteProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
