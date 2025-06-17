import { sql } from "../config/db.js";

export const addReview = async (req, res) => {
  const { product_id, rating, review } = req.body;
  const user_id = req.user?.id;
  const image_url = req.file?.path;

  if (!product_id) {
    return res.status(400).json({ error: "Product ID is required." });
  }

  const productId = parseInt(product_id, 10);
  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  if ((!rating || rating === 0) && (!review || review.trim() === "")) {
    return res.status(400).json({ error: "At least a rating or a review is required." });
  }

  if (rating) {
    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5." });
    }
  }

  if (review) {
    if (typeof review !== "string" || review.trim().length === 0) {
      return res.status(400).json({ error: "Review must be a non-empty string." });
    }
    if (review.length > 500) {
      return res.status(400).json({ error: "Review must be less than 500 characters." });
    }
  }

  try {
    const productExists = await sql`SELECT 1 FROM products WHERE id = ${productId}`;
    if (productExists.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const existingReview = await sql`
      SELECT 1 FROM reviews 
      WHERE product_id = ${productId} AND user_id = ${user_id}
    `;

    if (existingReview.length > 0) {
      return res.status(400).json({ error: "You have already reviewed this product." });
    }

    await sql`
      INSERT INTO reviews (product_id, user_id, rating, review, image_url)
      VALUES (${productId}, ${user_id}, ${rating}, ${review}, ${image_url})
    `;

    res.status(201).json({ 
      message: "Review submitted successfully.",
      review: {
        product_id: productId,
        user_id,
        rating,
        review,
        image_url
      }
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ 
      error: "Failed to submit review",
      details: error.message 
    });
  }
};


export const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await sql`
      SELECT 
        r.*,
        u.username,
        u.email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
    `;
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ 
      error: "Could not fetch reviews",
      details: error.message 
    });
  }
};
